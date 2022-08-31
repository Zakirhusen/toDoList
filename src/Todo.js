import React, { useEffect, useState } from "react";
const storageData = () => {
  let localData = JSON.parse(localStorage.getItem("localDataArray"));
  // console.log(localData);
  if (localData) {
    return localData;
  } else {
    return [];
  }
};
const Todo = () => {
  const [inputVal, setInputVal] = useState("");
  
  // for storing item array
  const [listItem, setListItem] = useState(storageData);
  
  // for storing editing item id
  const [itemId, setItemId] = useState('')

  const [toggleForUpdate, setToggleForUpdate] = useState(false);
  
  // for pagination
  let NoOfItemsPerPage=5
  let NoOfPages=Math.ceil(listItem.length/NoOfItemsPerPage);

  const [pageNo, setPageNo] = useState(0)
  const [pageItems, setPageItemsPage] = useState([])
// console.log("pageItems",pageItems)  
  const addList = () => {
    // checking for empty val
    if (!inputVal) {
      alert("Value of list cant be empty");
      // For updating list element
    } else if (inputVal && toggleForUpdate) {
      const editedItemArray=listItem.map((curElem,index)=>{
        if (curElem.id===itemId) {
          curElem.value=inputVal
        }
        return curElem;

      }
      )
      setListItem(editedItemArray)
      setToggleForUpdate(false)
      setInputVal('')
    } else {
      setListItem((prevData) => {
        console.log(prevData);
        const myNewInput = {
          id: new Date().getTime().toString(),
          value: inputVal,
          completed:false
        };
        return [...prevData, myNewInput];
      });
      setInputVal("");

    }
  };

  // deleting items from list
  const deleteItem = (id) => {
    const updateItems = listItem.filter((currElem) => currElem.id !== id);
    setListItem(updateItems);
  };

  // remove all items at a time
  const removeAll = () => {
    console.log("remove all is clicked");
    setListItem([]);
    setPageNo(0)
    setInputVal("")
  };

  // for updating item
  const editItem = (id) => {
    const itemToEdit =listItem.find((curElem)=>{
      return curElem.id===id
    })
    console.log('id',itemToEdit);
    setItemId(id)
    setInputVal(itemToEdit.value)
    setToggleForUpdate(true)
  };
  // for updating checkbox ticked or not 
  const checkBoxEdit=(id)=>{
      let checkBoxEditedArr=listItem.map((curElem,index)=>{
        if (id==curElem.id) {
          curElem.completed=!curElem.completed
        }
        return curElem
      })
      setListItem(checkBoxEditedArr)
  }

  // function for pagination 
  const paginationFunc=(e)=>{
    // setPageItemsPage(listItem.slice(e.target.value*5,e.target.value*5+5))
    setPageNo(e.target.value)
    console.log('pageNo,noOfPage',pageNo,NoOfPages);
    
    console.log('list of all item paginaiton' ,listItem);
    
  }
// for next and previous
const incPage=()=>{
  setPageNo(()=>{

    return +pageNo+1
  })
}
const decPage=()=>{
  setPageNo(()=>{
    return +pageNo-1
  })
}

  // updating the data to localStarage
  useEffect(() => {
    localStorage.setItem("localDataArray", JSON.stringify(listItem));
    setPageItemsPage(listItem.slice(pageNo*NoOfItemsPerPage,pageNo*NoOfItemsPerPage+NoOfItemsPerPage))
    console.log(pageNo,NoOfPages)
  }, [listItem,pageNo]);
// console.log(pageItems,"pageItems after use effect")
console.log("pageNo,NoOfPages",pageNo,NoOfPages)

  return (
    <>
      <div className="main d-flex flex-column  align-items-center">
        <h1 className="text-heading">Add your list here </h1>
        <div className="d-flex my-3 align-items-center">
          <input
            type="text"
            value={inputVal}
            onChange={(event) => setInputVal(event.target.value)}
          />
          {toggleForUpdate ? (
            <button
              className=" d-flex align-items-center"
              onClick={addList}
            >update</button>
          ) : (
            <button
              className="btn-add d-flex align-items-center"
              onClick={addList}
            >add</button>
          )}
        </div>
        <div className=" sub ">
          { pageItems.map((curItem, index) => {
            return (
              <div
                key={Math.random()}
                className="listItem d-flex align-items-center justify-content-between"
              >
              <div className="d-flex align-items-center justify-content-between checkbox" >
              {curItem.completed?<input onChange={() => checkBoxEdit(curItem.id)} className="inputCheck" type="checkbox" readOnly defaultChecked name="checkbox" id=""/>:<input  className="inputCheck" readOnly  type="checkbox" onChange={() => checkBoxEdit(curItem.id)} name="checkbox" id=""  />}
              <span>{pageNo*5+index+1}.</span>

              </div>
              
                <h5 className="item">{curItem.value}</h5>
                <div className="d-flex align-items-center justify-content-around ">
                  <button
                    className="btn-edit"
                    onClick={() => editItem(curItem.id)}
                  >update</button>
                  <button
                    className="btn-delete"
                    onClick={() => deleteItem(curItem.id)}
                  >delete</button>
                </div>
              </div>
            );
          })}
        </div>
        {/* for pagination */}
        <div>
        <button  className="pagination" onClick={decPage} disabled={pageNo<1?true:false} >prev</button>
        {  Array(Math.ceil(listItem.length/5)).fill(" 2").map((elem,index)=>{
            return <button className="pagination" onClick={(e)=>paginationFunc(e)} disabled={false} key={index} value={index} >{index+1}</button>

          })}
        <button  className="pagination" onClick={incPage} disabled={pageNo>NoOfPages-2?true:false} >next</button>
        </div>
        <div className="d-flex ">
          <button className="btn-remove" onClick={removeAll}>
            Remove All
          </button>
        </div>
      </div>
    </>
  );
};

export default Todo;
