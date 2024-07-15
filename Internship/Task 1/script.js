const inputBox = document.getElementById("input box");
const listContaimer = document.getElementById("list contaimer");

function addTask()
{
    if(inputBox.value === '')
        {
            alert("You must write something!");

        }
        else
        {
            let li = document.createElement("li");
            li.innerHTML = inputBox.value;
            listContaimer.appendChild(li);
            let span = document.createElement("span");
            span.innerHTML = "\u00d7";
            li.appendChild(span);

        }
        inputBox.value = "";
        saveData();
}

listContaimer.addEventListener("click", function(e)
{
    if(e.target.tagName === "LI")
    {
        e.target.classList.toggle("checked"); 
        saveData();
    }
    else if(e.target.tagName === "SPAN");
    {
        e.target.parentElement.remove(); 
        saveData();
    }
}, false);

function saveData()
{
   localStorage.setItem("data", listContaimer.innerHTML);
}

function showTask()
{
    listContaimer.innerHTML = localStorage.getItem("data");
}
showTask();