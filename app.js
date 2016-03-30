var favMovies = new Firebase("https://luvfilm.firebaseio.com/movies")
// var addMovie = document.getElementById("movieBtn").addEventListener("click", saveToList, false)

function saveToList(event) {
    if (event.which == 13 || event.keyCode == 13) { // as the user presses the enter key, attempt to save the data
        var movieName = document.getElementById("movieName").value.trim()
        if (movieName.length > 0) {
            saveToFB(movieName)
        }
        document.getElementById("movieName").value = ""
        return false
    }
}

function saveToFB(movieName) {
	//save the movie data to Firebase
	favMovies.push({
		name: movieName
	})
}

function refreshUI(list) {
	var lis = ""
	for (var i = 0; i < list.length; i ++) {
		lis += "<li data-key='" + list[i].key + "'>" + list[i].name + "[" + genLinks(list[i].key, list[i].name) + "]</li>"
	}
	document.getElementById("favMovies").innerHTML = lis
}

//link content for edit/delete functions
function genLinks(key, mvName) {
	var links = ""
	links += '<a href="javascript:edit(\'' + key + '\',\'' + mvName + '\')">Edit</a> | '
	links += '<a href="javascript:del(\'' + key + '\',\'' + mvName + '\')">Delete</a>'
    return links
}
//edit entries, old school prompt version
function edit(key, mvName) {
    var movieName = prompt("Update the movie name", mvName) //keep things simple
    if (movieName && movieName.length > 0) {
        // build the FB endpoint to the item in movies
        var updateMovieRef = buildEndPoint(key)
        updateMovieRef.update({
            name: movieName
        })
    }
}
 
function del(key, mvName) {
    var response = confirm("Are certain about removing \"" + mvName + "\" from your list?")
    if (response == true) {
        // build the FB endpoint to the item in movies 
        var deleteMovieRef = buildEndPoint(key);
        deleteMovieRef.remove();
    }
}
 
function buildEndPoint (key) {
	return new Firebase('https://luvfilm.firebaseio.com/movies' + key)
}

//this will get fired on initial load and whenever there is a change in data
favMovies.on("value", function(snapshot) {
	var data = snapshot.val()
	var list = []
	for (var key in data) {
		if(data.hasOwnProperty(key)) {
		name = data[key].name ? data[key].name : ""
		if(name.trim().length > 0) {
			list.push({
				name: name,
				key: key
			})
		  }
		}
	}
		//refresh UI
		refreshUI(list)
})