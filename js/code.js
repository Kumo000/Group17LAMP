const urlBase = 'https://lampgroup17.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doRegister()
{
	let firstName = document.getElementById("registerFirstName").value;
	let lastName = document.getElementById("registerLastName").value;
	let login = document.getElementById("registerLogin").value;
	let password = document.getElementById("registerPassword").value;

        // var hash  md5(password);

	document.getElementById("registerResult").innerHTML = "";

	// Check for empty fields
	// We can add more checks here as needed
	if(firstName === "" || lastName === "" || login === "" || password === ""){
		document.getElementById("registerResult").innerHTML = "Please fill in all fields.";
		return;
	}

	// Regex for name, login, and password validation
	let nameRegex = /^[a-zA-Z'-]+$/; // Must only contain letters, apostrophes, or hyphens
	let loginRegex = /^[a-zA-Z0-9_-]{3,}$/; // Must only contain letters, numbers, underscores, hyphens and at least 3 characters
	let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/; // Password must contain 8 characters, one letter, one number and one special character

	// Validate inputs using regex
	if(!nameRegex.test(firstName)){
		document.getElementById("registerResult").innerHTML = "First name can only contain letters.";
		return;
	}
	if(!nameRegex.test(lastName)){
		document.getElementById("registerResult").innerHTML = "Last name can only contain letters.";
		return;
	}
	if(!loginRegex.test(login)){
		document.getElementById("registerResult").innerHTML = "Login must be at least 3 characters and can only contain letters, numbers, underscores, or hyphens.";
		return;
	}
	if(!passwordRegex.test(password)){
		document.getElementById("registerResult").innerHTML = "Password must contain 8 characters, one letter, one number and one special character.";
		return;
	}

	// var hash = md5(password);

	document.getElementById("registerResult").innerHTML = "";

	let tmp = {
		firstname: firstName,
		lastname: lastName,
		login: login,
		password: password
	};

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.id < 1)
				{
					document.getElementById("registerResult").innerHTML =
						jsonObject.error || "Registration failed";
					return;
				}

				// Registration successful
				userId = jsonObject.id;
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
				window.location.href = "color.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "color.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let email = document.getElementById("email").value;
	let phone = document.getElementById("phone").value;

	document.getElementById("contactAddResult").innerHTML = "";

	if(firstName === "" || lastName === "" || email === "" || phone === ""){
		document.getElementById("contactAddResult").innerHTML = "Please fill in all fields.";
		return;
	}

	// Regex for name, email, and phone validation
	let nameRegex = /^[a-zA-Z'-]+$/; // Must only contain letters, apostrophes, or hyphens
	let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Basic email format
	let phoneRegex = /^\d{10}$/; // Must be exactly 10 digits

	// Validate inputs using regex
	if(!nameRegex.test(firstName)){
		document.getElementById("contactAddResult").innerHTML = "First name can only contain letters.";
		return;
	}
	if(!nameRegex.test(lastName)){
		document.getElementById("contactAddResult").innerHTML = "Last name can only contain letters.";
		return;
	}
	if(!emailRegex.test(email)){
		document.getElementById("contactAddResult").innerHTML = "Please enter a valid email address.";
		return;
	}
	if(!phoneRegex.test(phone)){
		document.getElementById("contactAddResult").innerHTML = "Phone number must be 10 digits.";
		return;
	}

	let tmp = {
		firstname:firstName,
		lastname:lastName,
		email:email,
		phone:phone,
		userId:userId
	};

	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);
				// Check for error in response
				if(jsonObject.error){
					document.getElementById("contactAddResult").innerHTML = jsonObject.error;
					return;
				}
				else{
					document.getElementById("contactAddResult").innerHTML = "Contact has been added";
					// Clear input fields after successful addition
					document.getElementById("firstName").value = "";
					document.getElementById("lastName").value = "";
					document.getElementById("email").value = "";
					document.getElementById("phone").value = "";
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

function searchContacts()
{
	let srch = document.getElementById("searchText").value;
	// Check for empty search field
	if (srch === "") {
		document.getElementById("contactSearchResult").innerHTML = "Search field cannot be empty";
		document.getElementById("contactList").innerHTML = "";
		return;
	}

	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";
	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );

				// Check for error in response
				if(jsonObject.error){
					document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
					document.getElementById("contactList").innerHTML = "";
					return;
				}
				// Check if any contacts were found
				if(jsonObject.results.length === 0){
					document.getElementById("contactSearchResult").innerHTML = "No contacts found";
					document.getElementById("contactList").innerHTML = "";
					return;
				}

				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					let contact = jsonObject.results[i];
					// Build the contact list as an HTML table
					contactList += "<tr>";
					contactList += "<td>" + contact.firstName + "</td>";
					contactList += "<td>" + contact.lastName + "</td>";
					contactList += "<td>" + contact.email + "</td>";
					contactList += "<td>" + contact.phone + "</td>";
					contactList += "</tr>";

				}
				
				document.getElementById("contactList").innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}
