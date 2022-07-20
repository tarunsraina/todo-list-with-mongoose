//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const mongoose=require("mongoose")

const app = express();

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/todolistDB")

const itemsSchema = {
    name : String
};

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name : "Javascript"
});

const item2 = new Item({
  name : "React"
});

const item3 = new Item({
  name : "BS"
})


const ListSchema = {
  name : String,
  items : [itemsSchema]
}

const List = mongoose.model("List",ListSchema)






app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res) {
  Item.find(function(err,foundItem){
    if(err){
      console.log(err)
    }else{
      if(foundItem.length==0){
        const defaultItems =[item1,item2,item3]
        Item.insertMany(defaultItems,function(err){
            console.log("Succesfully inserted");
        })
        res.redirect("/")
      }else{
        res.render("list", {listTitle: "Today", newListItems: foundItem});
      }
      
    }
  })
  

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name : itemName
  })

  item.save();
  res.redirect("/")
});

app.post("/delete", function(req,res){
  const checkedItemId = req.body.checkbox;
  console.log("This"+checkedItemId);
  Item.findByIdAndRemove(checkedItemId, function(err){
    if(!err){
      console.log("deleted")
      res.redirect("/")
    }
  } )
});

app.get("/:customListName",function(req,res){
  const customListName = req.params.customListName

  List.findOne({name:customListName,function(err,found){
    if(!err){
      if(!found){
        console.log("doesnt exist");
        //create a new list

        const list = new List({
          name : customListName,
          items : [itemsSchema]
        })
      
        list.save()
        res.redirect("/"+ customListName)
      }else{
        // show existing list
        res.render("list",{listTitle:found.name,newListItems:found.items})
      }
    }
  }})

})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
