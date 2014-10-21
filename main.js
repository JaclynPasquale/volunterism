
function getJSON(url, cb){
        //var url = arguments[0]
        //var cb = argument[1]
var xhr = new XMLHttpRequest();
xhr.open('GET',url, true);

xhr.onload = function() {
        cb(JSON.parse(xhr.responseText));   
};

xhr.send();
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function addItemToList($list, itemText){
    var $li = document.createElement("li");
    $li.innerHTML = itemText;
    $list.appendChild($li);
}

function neighborGrouping(list, groupSize, target){
  var listClone = list.slice(0);
      while( listClone.length > 0){
        var listItems = listClone.splice(0, groupSize);
        addItemToList(target, listItems.join(" &amp; "));
      }
}

function arrayShuffle(array){
  var arrayClone = array.slice(0);
  var temp;
  for(var i = 0; i < arrayClone.length; i++){
    var rand = getRandomInt(0, arrayClone.length);
    temp = arrayClone[i];
    arrayClone[i] = arrayClone[rand];
    arrayClone[rand] = temp;
  }
  return arrayClone;
}

document.addEventListener("DOMContentLoaded", function(){
    var $form = document.getElementById("generate-group");
    

function show(element){
	element.classList.remove("hidden");
}

function hide(element){
	element.classList.add("hidden");
}

var $select = $form.querySelector("select");
var $numBox = $form.querySelector("input[type='number']");
$select.addEventListener("change", function(event){
	if(event.currentTarget.value === "randN"){
	show($numBox);
	$numBox.classList.remove("hidden");
	}else {
	hide($numBox);
	}});

    $form.addEventListener("submit", function(event){
        event.preventDefault();

        getJSON('https://volunteerism-sscotth.firebaseio.com/students.json', function(data){
        var students = data;

        var $ul = document.getElementById("results");
        $ul.innerHTML = "";

        var groupCriteria = $form.querySelector("select").value;
        
        switch(groupCriteria){
                case "random-student":
                 var studentNumber = getRandomInt(0, students.length);
                 var studentName = students[studentNumber];
                 addItemToList($ul, studentName);
                 break;
                case "neighbor-pairing":
                  neighborGrouping(students, 2, $ul);
                 break;
                case "team-three":
                 neighborGrouping(students, 3, $ul);
                  break;
                case "randPair":
                 var shuffledStudents = arrayShuffle(students);
                 neighborGrouping(shuffledStudents, 2, $ul);
                 break;
                case "randN":
                 var shuffledStudents = arrayShuffle(students);
                 var numPeople = $numBox.value;
                 neighborGrouping(shuffledStudents, numPeople, $ul);
                 break;

        }

    });
});
});


