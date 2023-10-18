//creates the left side titles
let noList = [];
const titles = JSON.parse(localStorage.getItem('title'));
if(titles !== null){
    for(i = 0; i <  titles.length; i++){
        listName = titles[i];
        funTitleMaking(listName)
    }
}

//storing the saved lists
const oldTDs = JSON.parse(localStorage.getItem('savedTD'));
let listOfTDs = oldTDs ?? [];


//makes the title of the list
document.getElementById('submit').addEventListener('click', funListName);

function funListName() {
    let LNInput = document.getElementById('name');
    let listName = LNInput.value.trim();
    funTitleMaking(listName);
    //deletes the input
    LNInput.value = "";
}

//Makes the List Name on left
function funTitleMaking(listName){
    if (!noList.includes(listName) && listName !== "") {
        let boxCode = `
        <button class="thing-in-list" id="${listName}">
            <div class="center">
                <h2>${listName}</h2>
                <button class="${listName}" id="delX">x</button>
            </div>
        </button>
        `;
        let emptyDiv = document.createElement('div');
        emptyDiv.innerHTML = boxCode;
    
        let addToList = document.getElementById('addToList');
        addToList.prepend(emptyDiv);

        //Adds the abillity to delete the Titles
        funTitlesDel(listName);
    
        //addes an event listener to created list
        let theLName = document.getElementById(`${listName}`);
        theLName.addEventListener('click', () => funMake(listName));
        
        //save for the title
        noList.push(listName);
        localStorage.setItem('title', JSON.stringify(noList));
    }
}

//adds the backbone to add todos
function funMake(listName) {
    let stuffCode = `
        <div>
            <h1 id="title">${listName}</h1>
        </div>
        <div>
            <input type="search" id="word-search">
        </div>
        <div>
            <button id="select-search">Search</button>
        </div>
        <div class="gray-bar"></div>
        <div id="to-do"></div>
        <div>
            <input type="text" id="to-do-add">
            <button class="add" id="add">
                <h3>Add</h3>
            </button>
        </div>
    `;
    let addToRB = document.getElementById('RB');
    addToRB.innerHTML = stuffCode;

    //search for ToDos
    let selectSearch = document.getElementById('select-search');
    selectSearch.addEventListener('click', funSearch);

    //Inserts the Saved Things
    funCheckSaves(listName);

    //Edit Functionability
    funEdit();

    const add = document.getElementById('add')
    add.addEventListener('click', () => funToDo(listName));
}

//Things User Wants to Add to the Todo
function funToDo() {
    let typedElement = document.getElementById('to-do-add');
    let typedThingToDo = typedElement.value.trim();
    if (typedThingToDo !== "") {

        //adds _num if there are same names
        typedThingToDo = funMultibles(typedThingToDo);

        let stuffCode = `
            <div class="thing-in-list border">
                <div class="space">
                    <input type="checkbox" class="Check">
                    <div>
                        <h4 id="edit" contenteditable="true">
                            ${typedThingToDo}
                        </h4>
                    </div>
                </div>
                <button class="del">
                    <h3>Delete</h3>
                </button>
            </div>
        `;
        let emptyDivTD = document.createElement('div');
        emptyDivTD.innerHTML = stuffCode;

        let addToTD = document.getElementById('to-do');
        addToTD.append(emptyDivTD);

        //Saving Things
        saveMe(typedThingToDo);

        //Add Functionability to Check Box
        funCheck();

        //Add Functionabillity to Del Button
        funButtonDel();

        // Clears the input after adding the item
        typedElement.value = "";
    }
}
//checks to see if there same things in the ToDo and adds _num
function funMultibles(typedThingToDo){
    const h4s = document.querySelectorAll('h4');
    let existingStuff = [];
    for(i = 0; i < h4s.length; i++){
        const newFour = h4s[i].textContent.trim();
        let words = newFour.split('_');
        words = words.filter(item => item == typedThingToDo);
        existingStuff.push(words);
    }
    existingStuff = existingStuff.filter(item => item == typedThingToDo);
    if (existingStuff.length !== 0) {
        let num = existingStuff.length + 1;
        typedThingToDo = `${typedThingToDo}_${num}`;
    }
    return typedThingToDo;
}

//saving things
function saveMe(typedThingToDo){
    const title = document.getElementById('title');
    const obName = title.innerHTML;

    const listItem = {
        [obName]: typedThingToDo
    };
    listOfTDs.push(listItem);

    localStorage.setItem('savedTD', JSON.stringify(listOfTDs));
}

//inserting the saved things
function funCheckSaves(listName) {
    const savedToDos = listOfTDs.filter(obj => listName in obj);
    let numNeeded = savedToDos.length;

    for(i = 0; i < numNeeded; i++) {
        typedThingToDo = savedToDos[i][listName];
        let textOfCode = document.createElement('div')
        let savedCode = `
            <div class="thing-in-list border">
                <div class="space">
                    <input type="checkbox" class="Check">
                    <div>
                        <h4 id="edit" contenteditable="true">
                            ${typedThingToDo}
                        </h4>
                    </div>
                </div>
                <button class="del">
                    <h3>Delete</h3>
                </button>
            </div>
        `;
        textOfCode.innerHTML = savedCode;
        let addToTD = document.getElementById('to-do');
        addToTD.append(textOfCode);

        //Edit functionability
        funEdit();

        //add functionability to Check Box
        funCheck();

        //add functionabillity to del button
        funButtonDel();
    }
}

//add delete button functionabillity to ToDOs
function funButtonDel() {
    const deleteButtons = document.querySelectorAll('.del');

    deleteButtons.forEach((del) => {
        del.addEventListener('click', () => {
            const h4Element = del.parentElement.querySelector('h4');
            const ToBeDel = h4Element.textContent.trim();

            const title = document.getElementById('title');
            const obName = title.innerHTML;

            listOfTDs = listOfTDs.filter(item => item[obName] !== ToBeDel);
            localStorage.setItem('savedTD', JSON.stringify(listOfTDs));
            del.parentElement.remove();
        });
    });
}

//add delete button functionabillity to x buttons
function funTitlesDel(listName) {
    const xbutton = document.querySelector('#delX');
    xbutton.addEventListener('click', () => {
        const dely = document.getElementById(listName);

        listOfTDs = listOfTDs.filter(item => !item.hasOwnProperty(listName));
        localStorage.setItem('savedTD', JSON.stringify(listOfTDs));

        noList = noList.filter(item => item !== listName)
        localStorage.setItem('title', JSON.stringify(noList));

        document.getElementById('RB').innerHTML = "";
        dely.remove();
        xbutton.remove();
    });
}

//Check Mark Press-ability and Deleting
function funCheck(){
    const click = document.querySelectorAll('.Check');

    click.forEach((cli) => {
        cli.addEventListener('click', () => {
            const h4Element = cli.parentElement.querySelector('h4');
            const ToBeDel = h4Element.textContent.trim();

            const title = document.getElementById('title');
            const obName = title.innerHTML;

            listOfTDs = listOfTDs.filter(item => item[obName] !== ToBeDel);
            localStorage.setItem('savedTD', JSON.stringify(listOfTDs));
            setTimeout(() => {  cli.parentElement.parentElement.remove(); }, 1000);
        });
    });
    
}



//Search
function funSearch() {
    let word = document.getElementById('word-search').value.toLowerCase().trim();

    const h4s = document.querySelectorAll('h4');
    let existingStuff = [];

    for (let i = 0; i < h4s.length; i++) {
        let newFour = h4s[i].textContent.trim();
        existingStuff.push(newFour);
        let thingTNS = h4s[i].parentElement.parentElement.parentElement;
        if (!existingStuff.includes(word) && word !== '') {
            thingTNS.style.display = 'none';
        }
        else{
            thingTNS.style.display = '';
        }
    }
}


//Edit the ToDos
function funEdit(){
    let edThing = document.querySelectorAll('#edit');
    edThing.forEach((ed) => {
        ed.addEventListener('click', () => {
            const selected = ed;
            const oldWord = ed.innerHTML.trim();
            const tempListener = () => {
                if(selected.innerHTML !== ''){
                    const title = document.getElementById('title');
                    const obName = title.innerHTML;

                    let positonOfName = listOfTDs.findIndex(item => item[obName] === oldWord);

                    const listItem = {
                        [obName]: selected.innerHTML.trim()
                    };
                    listOfTDs[positonOfName] = listItem;

                    localStorage.setItem('savedTD', JSON.stringify(listOfTDs));
                }
                else{
                    selected.innerHTML = oldWord;
                }
                document.removeEventListener('click', tempListener);
            }

            setTimeout(() => {
                document.addEventListener('click', tempListener)
            }, 1000);
    
        });
    });
}
