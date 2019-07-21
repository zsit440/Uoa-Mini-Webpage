let currentTab = " ";
let modal = ""
      function clickHome() {
         if (currentTab != "Home") {
            currentTab = "Home";
            showNoTabs();
			
            document.getElementById("Home").style.backgroundColor = "lightBlue";
            document.getElementById("SectionA").style.display = "inline";
			
			
         }
		 
      }
	  function getCourses(){
		 const url = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/courses";
	     const xhr = new XMLHttpRequest();
		 xhr.open("GET", url, true);
		 xhr.setRequestHeader("Content-Type", "application.json:charset=UTF-8")
		 let resp;
         xhr.onload = () => {
         resp = JSON.parse(xhr.responseText);
		 //resp = JSON.stringify(resp.data, function (key, value) {return (value === undefined) ? "" : value});
		 showCourses(resp.data);
   }
		xhr.send(null);
}
	  
	  function showCourses(course){
		 course.sort(compareID);
		 let tableContent = "<tr class='CourseTitle' align = 'center'><td>CourseID</td><td>Description</td><td>Points</td><td>TimeTable</td></tr>\n";
		 var count = 0;
		 let TTCount;
			let addRecord = (record) => {
			TTCount = "TT" + count.toString();
		    let title = record.title;
		    let requirment = (record.rqrmntDescr  == null) ? '' : record.rqrmntDescr;
		    let details = (record.description  == null) ? '' : record.description;  
		    let description = "<td>" + title + "<br>" + details  +  
			 "<br>" + requirment + "<br><br></td>";
	        tableContent += "<tr class='Courses'><td>COMPSCI" + " " + 
			record.catalogNbr   + "</td>" + description + "<td>" + record.unitsAcadProg + "</td><td>" + "<button id='myBtn' onclick='modal.style.display = \"block\";getTimeTable("+ record.catalogNbr +
			");'>TimeTable</button></td></tr>\n"
			//console.log(tableContent);
			//console.log(timetable);
			count += 1
			}
			course.forEach(addRecord);
			modal = document.getElementById('timeslot'); //<!--code from https://www.w3schools.com/howto/howto_css_modals.asp>
			let btn = document.getElementById("myBtn");
			let span = document.getElementsByClassName("close")[0]; 
			span.onclick = function() {
				modal.style.display = "none";
	}
			window.onclick = function(event) {
				if (event.target == modal) {
					modal.style.display = "none";
				}
			}
			document.getElementById("displayCourses").innerHTML = tableContent;
}
		function getTimeTable(courseID){
			const uri = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/course?c="+courseID;
			const xhr = new XMLHttpRequest();
			xhr.open("GET", uri, true);
			//xhr.setrequesthead = 
			let timetable;
			xhr.onload = () => {
				const resp = JSON.parse(xhr.responseText);
				//console.log(resp);
				showTimeTable(courseID,resp.data);
				//console.log(timetable)
				//alert(timetable)
				
		}	
			xhr.send(null);
			
			
			
		}
		
		function showTimeTable(courseID,TTList){
				
				//console.log(TTList);
				let ID = "COMPSCI " + courseID
				let TTContent = "<table id = '{0}'><tr class = 'time' >".replace("{0}", ID) + ID +"</tr><tr><td>ClassNbr</td><td>ClassSection</td><td>Start/End Dates</td><td>Days</td><td>Times</td><td>Room</td></tr>\n" ;
				
				let addContent = (Content) =>{
					//console.log(Content.meetingPatterns);
					let meeting = Content.meetingPatterns;
					let classNbr = "";
					let TTDate = "";
					let TTtime = "";
					let room = "";
					let day = "";
					for (key in meeting){
						//console.log(Content.classNbr);
						classNbr += Content.classNbr + "<br>";
						let startDate = (meeting[key].startDate == null) ? "": meeting[key].startDate;
						let endDate = (meeting[key].endDate == null) ? "": meeting[key].endDate;
						let startTime = (meeting[key].startTime == null) ? "": meeting[key].startTime;
						let endTime = (meeting[key].endTime == null) ? "": meeting[key].endTime;
						TTDate +=  startDate + " - " + endDate   + "<br>" ;
						TTtime += startTime + " - " +  endTime + "<br>" ;
						room += meeting[key].location + "<br>";
						day += meeting[key].daysOfWeek+ "<br>" ; 
					}
				TTContent += "<tr class = 'timetable'><td>" + classNbr + "</td><td>" + Content.classSection + "</td><td>" + TTDate + "</td><td>" +
							day + "</td><td>" +TTtime + "</td><td>" + room + "</td></tr>\n";
				
				}
						TTList.forEach(addContent);
						TTContent += "</table>"
						document.getElementById("displayTimeTable").innerHTML = TTContent;
			//alert(TTContent)
			//console.log(TTContent);
			//document.write("<div><tr><table id = '{0}' width = 100%>"+ TTContent+ "</table></tr></div>\n".replace("{0}", TTCount));
			}

		function getPeople(){
			const url = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/people";
			const xhr = new XMLHttpRequest();
			xhr.open("GET", url, true);
			xhr.setRequestHeader("Content-Type", "application.json:charset=UTF-8");
			let resp;
            xhr.onload = () => {
               resp = JSON.parse(xhr.responseText);
		       //resp = JSON.stringify(resp.data, function (key, value) {return (value === undefined) ? "" : value});
		       showPeople(resp.list);
   }
		    xhr.send(null);   
		}
		function showPeople(Person){
			Person.sort(function(a,b){
			   if(a.lastname < b.lastname) return -1;
		       else if(a.lastname > b.lastname ) return 1;return 0;}
			)
			
			let tableContent = "<tr class='PeopleName'><td>Profile</td><td>Name</td><td>Phone</td><td>Email</td><td>Vcard</td></tr>\n";
			let addRecord = (record) =>{
					let title = (record.title  == null) ? "": record.title;
					let extn = (record.extn == null) ? "": "<a href ='tel:+649923" + record.extn.substr(1) + "'>64 9 923 " + record.extn.substring(1) + "</a>" ;
					tableContent += (record.imageId == null) ? "<tr class ='noimg'><td><img class = 'profile' src = 'https://unidirectory.auckland.ac.nz/people/imageraw/id-watson/1/small'width = '150' height = '150'></td><td>" 
					:"<tr class ='haveimg'><td><img class = 'profile' src = 'https://unidirectory.auckland.ac.nz/people/imageraw/" +record.profileUrl[0] 
					+ "/" + record.imageId + "/small' width ='150' height = '150'></td><td>" 
					let email = "<a href ='mailto:" + record.emailAddresses[0] + "'>" + record.emailAddresses[0] + "</a>"
					tableContent +=  title + ' ' +
					record.firstname + ' ' + record.lastname + "</td>"
					+ "<td>" + extn + "</td><td>" + email + "</td><td>" + "<a href = 'https://unidirectory.auckland.ac.nz/people/vcard/{1}'>&#128100</a>".replace("{1}",record.profileUrl[0])		+"</td></tr>\n" ;
				}
			
			Person.forEach(addRecord);
			document.getElementById("displayPeople").innerHTML = tableContent;
		}
		
	  function getNews(){
		 const url = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/news";
		 const xhr = new XMLHttpRequest();
		 xhr.open("GET", url, true);
		 xhr.setRequestHeader("Accept", "application/json");
		 let resp;
          xhr.onload = () => {
              resp = JSON.parse(xhr.responseText);
			  showNews(resp);
	  }
		 xhr.send(null);
	  }
	  function showNews(data){
		  let newsList = "";
		  let addNewsList = (news) => {
			  newsList += "<h2 class = 'newsTitle'><a href='{0}'>".replace("{0}", news.linkField) + news.titleField + "</a></h2><p class = 'newsDesc'>" + news.descriptionField + "</p><p class = 'newsDate' >" + 
								news.pubDateField.substring(0, (news.pubDateField).length - 15) + "</p><br><br>";
	  }
		  data.forEach(addNewsList);
		  document.getElementById("displayNews").innerHTML = newsList;
	  }
	  
	  function getNotices(){
		 const url = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/notices";
		 const xhr = new XMLHttpRequest();
		 xhr.open("GET", url, true);
		 xhr.setRequestHeader("Accept", "application/json");
		 let resp;
          xhr.onload = () => {
              resp = JSON.parse(xhr.responseText);
			  showNotices(resp);
	  }
		 xhr.send(null);
	  }
	  
	  function showNotices(data){
		  let noticesList = "";
		  let addnoticesList = (notices) => {
			  noticesList += "<h2 class = 'newsTitle'><a href='{0}'>".replace("{0}", notices.linkField) + notices.titleField + "</a></h2><p class = 'newsDesc'>" + notices.descriptionField + "</p><p class = 'newsDate' >" + 
								notices.pubDateField.substring(0, (notices.pubDateField).length - 15) + "</p><br><br>";
	  }
		  data.forEach(addnoticesList);
		  document.getElementById("displayNotices").innerHTML = noticesList;
	  }
	  
	  function showGuestBook(){
		 const url = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/htmlcomments";
		 const xhr = new XMLHttpRequest();
		 xhr.open("GET", url, true);
		 //xhr.setRequestHeader("Accept", "application/json");
		 //let resp;
		 xhr.onload = () => {
			 document.getElementById("displayGuestBook").innerHTML = xhr.responseText;
	  }
			xhr.send(null);
	  }
	  
	  function getGuestBook(){
		  var username = document.getElementById("getName").value;
		  var comment = document.getElementById("getComment").value;
		  username = new String(username);
		  comment = new String(comment);
		  const url = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/comment?name=" + username;
		  const xhr = new XMLHttpRequest();

		  xhr.open("POST", url, true);
		  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		  xhr.onload = () => {
			 showGuestBook();
		  };
		  xhr.send(JSON.stringify(comment));
	  }
	  
      function compareID(a,b){
		  if(a.catalogNbr < b.catalogNbr) return -1;
		  else if(a.catalogNbr > b.catalogNbr ) return 1;
		  
		  return 0;
	  }
	  
	  

      function clickCourses() {
         if (currentTab != "Courses") {
            currentTab = "Courses";
            showNoTabs();
            document.getElementById("Courses").style.backgroundColor = "lightBlue";
            document.getElementById("SectionB").style.display = "inline";
			getCourses();
         }
      }

      function clickPeople() {
		 document.getElementById("SectionF").style.dislpay = "block";
         if (currentTab != "People") {
            currentTab = "People";
            showNoTabs();
            document.getElementById("People").style.backgroundColor = "lightBlue";
            document.getElementById("SectionC").style.display = "inline";
			getPeople();
         }
      }
	  function clickNews() {
         if (currentTab != "News") {
            currentTab = "News";
            showNoTabs();
            document.getElementById("News").style.backgroundColor = "lightBlue";
            document.getElementById("SectionD").style.display = "inline";
			getNews();
         }
      }
	  
	  function clickNotices() {
         if (currentTab != "Notices") {
            currentTab = "Notices";
            showNoTabs();
            document.getElementById("Notices").style.backgroundColor = "lightBlue";
            document.getElementById("SectionE").style.display = "inline";
			getNotices();
         }
      }
	  
	  function clickGuestBook() {
		 document.getElementById("SectionF").style.dislpay = "block";
         if (currentTab != "GuestBook") {
            currentTab = "GuestBook";
			showGuestBook();
            showNoTabs();
            document.getElementById("GuestBook").style.backgroundColor = "lightBlue";
            document.getElementById("SectionF").style.display = "inline";
			//showGuestBook();
         }
      }
	  
	  

      function showNoTabs() {
         document.getElementById("Home").style.backgroundColor = "transparent";
         document.getElementById("Courses").style.backgroundColor = "transparent";
         document.getElementById("People").style.backgroundColor = "transparent";
		 document.getElementById("News").style.backgroundColor = "transparent";
         document.getElementById("Notices").style.backgroundColor = "transparent";
         document.getElementById("GuestBook").style.backgroundColor = "transparent";
		 //document.getElementById("Registration").style.backgroundColor = "transparent";
		 //document.getElementById("Login").style.backgroundColor = "transparent";
         document.getElementById("SectionA").style.display = "none";
         document.getElementById("SectionB").style.display = "none";
         document.getElementById("SectionC").style.display = "none";
		 document.getElementById("SectionD").style.display = "none";
         document.getElementById("SectionE").style.display = "none";
         document.getElementById("SectionF").style.display = "none";
      }