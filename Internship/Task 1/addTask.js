function addTask() {
    if (inputBox.value === ''); {
        alert("You must write something");
    }
    {
        {
            let li = document.createElement("li");
            li.innerHTML = inputBox.value;
            listContaimer.appendChild(li);
        }
    }


}
