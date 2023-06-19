#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');
const list = fs.readFileSync('list.json');
let parsedList = JSON.parse(list);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//prompt the user to enter a command
rl.question('Please enter command : ', (command) => {
  //if the user enters CREATE, prompt the user to enter a directory
  if (command === 'CREATE') {
    rl.question('Please enter directory : ', (input) => {
      console.log(`CREATE ${input}`);
      //if there are no directories created, add the directory to list.json
      if (Object.keys(list).length === 0) {
        let dir = {};
        dir[input] = {};
        //write the data into "list.json"
        fs.writeFileSync("list.json", JSON.stringify(dir));
      }
      //if directories already exist in the list.json
      else {
        //if the user is trying to create a subdirectory, split the directories into an array of elements
        if (input.includes('/')) {
        const inputArr = input.split('/');
        let obj = parsedList;
        //iterate through inputArr and the list.json data
        for (let i = 0; i < inputArr.length; i++){
          for (let key in obj){
            if (inputArr[i] === key) continue;
            //invoke addDirectory if we have reached the correct directory to add a subdirectory
            else if (inputArr[i] !== key && inputArr[i-1] === key){
              addDirectory(inputArr, key, obj[key], parsedList, i)
            }
          }
        }
        }
        //if the user entered a new directory
        else {
          parsedList[input] = {};
          const updatedList = JSON.stringify(parsedList);
          fs.writeFileSync("list.json", updatedList);
        }   
      }
      //close the prompt after the directory has successfully been created
      rl.close();
    })

  }
  /*
    if the user enters LIST, print out all directories in list.json, making sure to
    indent subdirectories
  */
  if (command === 'LIST') {
    function printDirectory(parsedList, space = ' ') {
      for (let key in parsedList) {
        console.log(space + key)
        if (Object.values(key).length !== 0) {
          printDirectory(parsedList[key], space + ' ')
        }
      }
    }
    printDirectory(parsedList)
    rl.close();
  }
  //if the user enters DELETE, prompt the user to enter a directory
  if (command === 'DELETE') {
    rl.question('Please enter directory : ', (input) => {
      console.log(`DELETE ${input}`);
      const deleteThis = input.split('/');
      let obj = parsedList
      let targetObj = obj;
      for (let i = 0; i < deleteThis.length; i++){
          //if targetObj has the current directory
          if (targetObj.hasOwnProperty(deleteThis[i])){
            if (i === deleteThis.length-1) {
              delete targetObj[deleteThis[i]]
            } else {
              //reassign targetObj to keep track of the object that we want to delete
              targetObj = targetObj[deleteThis[i]];
            }
          }
          //if the directory does not exist, print that the directory cannot be deleted because it does not exist
          else {
            console.log(`Cannot delete ${input} - ${deleteThis[i]} does not exist`)
            rl.close();
          }
        
      }
      fs.writeFileSync("list.json", JSON.stringify(parsedList));
      rl.close();
    })
  }
})

function addDirectory(inputArr, key, value, obj, i) {
  //if the current key has a value of an empty object, replace the empty object with the subdirectory entered by the user
  if (Object.values(value).length === 0) {
    let newObj = {}
    newObj[inputArr[i]] = {}
    obj[key] = newObj
    fs.writeFileSync("list.json", JSON.stringify(parsedList));
    return;
  }
  //else, recursively call the function until we have reached the correct subdirectory
  else {
    let newKey = inputArr[i]
    let newValue = value[inputArr[i]]
    addDirectory(inputArr, newKey, newValue, value, i+1)
  }
}






















