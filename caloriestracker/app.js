// Storage Controller
const StorageCtrl = (function(){
  // Public methods
  return {
    storeItem: function(item){
      let items;
      // Check if any items in ls
      if(localStorage.getItem('items') === null){
        items = [];
        // Push new item
        items.push(item);
        // Set ls
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // Get what is already in ls
        items = JSON.parse(localStorage.getItem('items'));

        // Push new item
        items.push(item);

        // Re set ls
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(updatedItem){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(updatedItem.id === item.id){
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id){
      let items = JSON.parse(localStorage.getItem('items'));
      
      items.forEach(function(item, index){
        if(id === item.id){
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function(){
      localStorage.removeItem('items');
    }
  }
})();
// Item Controller
const ItemCtrl = (function () {
    // ITEM Constructeur
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    // DATA Structure / State
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0,
    };
    // public methods
    return {
        getItems: function () {
            return data.items;
        },
        logData: function () {
            return data;
        },
        addItem: function (name, calories) {
            let ID;
            // create id
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            // calories to number
            calories = parseInt(calories);
            // create new item
            let newItem = new Item(ID, name, calories);
            data.items.push(newItem);
            return newItem;
        },
        getItemById: function (id) {
            let found = null;
            let x = StorageCtrl.getItemsFromStorage();
            x.forEach(item => {
                if (item.id == id) {
                    found = item;
                }
            });
            return found;

        },
        updateItem: function (name, calories) {
            // calories to number
            calories = parseInt(calories);
            let found = null;
            data.items.forEach(item => {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        setCurrentItem: function (item) {
            data.currentItem = item;
        },
        deleteItem: function (id) {
           // Get ids
            const ids = data.items.map(function (item) {
                return item.id;
            });
            // Get index
            const index = ids.indexOf(id);

            // Remove item
            data.items.splice(index, 1);
            data.currentItem = null;
        },
        clearAllItems: function(){
            data.items = [];
        },
        getCurrentItem: function () {
            return data.currentItem;
        },
        getTotalCalories: function () {
            let total = 0;
            data.items = StorageCtrl.getItemsFromStorage();
            data.items.forEach((item) => {
                total += item.calories;
            });
            // set total cal in data struct
            data.totalCalories = total;
            return data.totalCalories;
        }
    };
})();

// UI Controller
const UICtrl = (function () {
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemName: '#item-name',
        itemCalories: '#item-calories',
        totalCalories: '.total-calories',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        clearBtn: '.clear-btn',
        backBtn: '.back-btn',
        listItems: '#item-list li',
        

    };
    // public methods
    return {
        populateItemList: function (items) {
            const itemlist = document.querySelector(UISelectors.itemList);
            items.forEach(elem => {
                itemlist.innerHTML += `
                <li id="item-${elem.id}" class="collection-item">
                    <strong>${elem.name}: </strong><em>${elem.calories} Calories</em><a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i></a>
                </li>
                `
            });
        },
        getSelectors: function () {
            return UISelectors;
        },
        getItemInput: function (e) {
            return {
                name: document.querySelector(UISelectors.itemName).value,
                calories: document.querySelector(UISelectors.itemCalories).value,
            }
        },
        addListItem: function (item) {
            // show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // create li element
            const li = document.createElement('li');
            // add class
            li.className = 'collection-item';
            // add ID
            li.id = `item-${item.id}`;
            li.innerHTML = `
            <strong>${item.name}: </strong><em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                    `;
            // insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function (item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // turn node list into array
            listItems = Array.from(listItems);
            listItems.forEach(listitem => {
                const itemID = listitem.getAttribute('id');
                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `
                    <strong>${item.name}: </strong><em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                    `;
                }
            });
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemName).value = '';
            document.querySelector(UISelectors.itemCalories).value = '';
        },
        addItemToForm: function () {
            document.querySelector(UISelectors.itemName).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCalories).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            });
    },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showCalories: function (totalcal) {
            document.querySelector(UISelectors.totalCalories).textContent = totalcal;
        },
        clearEditState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function () {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        }
        
    };
})();

// APP Controller
const App = (function (ItemCtrl, StorageCtrl,UICtrl) {
    // load event listeners
    const loadEventListeners = function () {
        // get ui selectors
        const UISelectors = UICtrl.getSelectors();
        // add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        // disable submit on enter
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        })
        // edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
        // update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
        // back btn event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
        // Clear items event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

    }
    // show total calories
    UICtrl.showCalories(ItemCtrl.getTotalCalories());
    // add item submit
    const itemAddSubmit = function (e) {
        // Get form input from UI Controller
        const input = UICtrl.getItemInput();
        if (input.name !== '' && input.calories !== '') {
            // add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            // add item to UI list
            UICtrl.addListItem(newItem);
            //Store in localStorage
            StorageCtrl.storeItem(newItem);
            // clear field
            UICtrl.clearInput();
            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to UI
            UICtrl.showCalories(totalCalories);
        }
        e.preventDefault();
    }
    const itemEditClick = function (e) {
        if (e.target.classList.contains('edit-item')) {
            // get the list item id
            const listId = e.target.parentNode.parentNode.id;
            // get id from string item-id
            const id = parseInt(listId.split('-')[1]);
            // get item
            const itemToEdit = ItemCtrl.getItemById(id);
            // set current item
            ItemCtrl.setCurrentItem(itemToEdit);
            // add item to form
            UICtrl.addItemToForm();

        }
        e.preventDefault();
    };
    // update item submit
    const itemUpdateSubmit = function (e) {
        // get item inputs
        const inputs = UICtrl.getItemInput();
        // update item
        const updateItem = ItemCtrl.updateItem(inputs.name, inputs.calories);
        // update the UI
        UICtrl.updateListItem(updateItem);
        // Update local storage
        StorageCtrl.updateItemStorage(updateItem);
        UICtrl.clearEditState();
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showCalories(totalCalories);
        e.preventDefault();
    };
    // Delete button event
    const itemDeleteSubmit = function (e) {
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete from data structure
        ItemCtrl.deleteItem(currentItem);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showCalories(totalCalories);

        e.preventDefault();
    };
    // Clear items event
    const clearAllItemsClick = function () {
        // Delete all items from data structure
        ItemCtrl.clearAllItems();

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showCalories(totalCalories);

        // Remove from UI
        UICtrl.removeItems();

        // Clear from local storage
        StorageCtrl.clearItemsFromStorage();

        // Hide UL
        UICtrl.hideList();
    
    };
    // public methods
    return {
        init: function () {
            // clear edit state / set initial set
            UICtrl.clearEditState();
            // fetch items
            const items = ItemCtrl.getItems();
            // check if there is items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                // populate list with items
                UICtrl.populateItemList(items);
            }
            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to UI
            UICtrl.showCalories(totalCalories);
            // load events listeners
            loadEventListeners();
            
        },
    };
})(ItemCtrl, StorageCtrl, UICtrl);

// INIT APP
App.init();

// GET ITEMS
