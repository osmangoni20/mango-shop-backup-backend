const express = require('express')
const cors = require('cors')
require('dotenv').config();
const app = express()
app.use(cors());
app.use(express.json());
const port = process.env.PORT||5200

const MongoClient = require('mongodb').MongoClient;
const { ObjectID, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.77ufn.mongodb.net/Ripe-Mango-Shop?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
 
  const MangoCollection = client.db("Ripe-Mango-Shop").collection("Mango-Products");
  const MangoPickleCollection = client.db("Ripe-Mango-Shop").collection("Pickle-Products");
  const MangoChutneyCollection = client.db("Ripe-Mango-Shop").collection("Chutney-Products");
  const OrderCollection=client.db("Ripe-Mango-Shop").collection("Confirm-Orders");
  const OrderCartCollection=client.db("Ripe-Mango-Shop").collection("Order-Cart-Products");

// perform actions on the collection object
              // -------------------Add Data in Database-----------------
  app.post('/addProducts/Ripe-Mango',(req,res)=>{
    console.log(req.body)
    MangoCollection.insertOne(req.body)
    .then(result=>{
      res.send(result);
      console.log(result)
    })
  })

  app.post('/addProducts/Pickle',(req,res)=>{
    console.log(req.body)
    MangoPickleCollection.insertOne(req.body)
    .then(result=>{
      res.send(result);
      console.log(result)
    })
  })

  app.post('/addProducts/Chutney',(req,res)=>{
    console.log(req.body)
    MangoChutneyCollection.insertOne(req.body)
    .then(result=>{
      res.send(result);
      console.log(result)
    })
  })
  //           // ----------------------x--------------------

   app.get('/ripeMango',(req,res)=>{
     MangoCollection.find()
     .toArray((err,document)=>{
       res.send(document);
       err&&console.log(err);
     })
   })

   app.get('/mangoPickle',(req,res)=>{
    MangoPickleCollection.find()
    .toArray((err,document)=>{
      res.send(document);
      err&&console.log(err);
    })
  })

  app.get('/mangoChutney',(req,res)=>{
    MangoChutneyCollection.find()
    .toArray((err,document)=>{
      res.send(document);
      err&&console.log(err);
    })
  })

  //Add Order to Database
   app.post('/addOrder',(req,res)=>{
     OrderCollection.insertOne(req.body)
     .then(result=>{
       res.send(result.insertedCount>0)
     })
   })
   //Add Product to Order Cart
   app.post('/addToCart',(req,res)=>{
     OrderCartCollection.insertOne(req.body)
     .then(result=>{
       res.send(result.insertedCount>0)
     })
   })

   //Product By Type

   app.get('/ProductByType/:type',(req,res)=>{
     const type=req.params.type;
    MangoCollection.find({productType:type})
    .toArray((err,document)=>{
      res.send(document);
      err&&console.log(err);
    })
  })

   // Product By Id

   app.get('/ProductById/:id/:type',(req,res)=>{
   
    const id=req.params.id;
    const ProductType=req.params.type;

    if(ProductType==="Ripe-Mango"){
      MangoCollection.find({_id:ObjectID(id)})
      .toArray((err,document)=>{
        res.send(document[0]);
        err&&console.log(err)
      })
    }
    else if(ProductType==="Chutney"){
      MangoChutneyCollection.find({_id:ObjectID(id)})
      .toArray((err,document)=>{
        res.send(document[0]);
        err&&console.log(err)
      })
    }
    else{
      MangoPickleCollection.find({_id:ObjectID(id)})
      .toArray((err,document)=>{
        res.send(document[0]);
        err&&console.log(err)
      })
    }

   })

   //Get Product from order cart

   app.get('/cartProducts',(req,res)=>{
    OrderCartCollection.find()
     .toArray((err,document)=>{
        res.send(document);
        err&&console.log(err);
     })
   })

// Delete Single Card Product
   app.get('/deleteCardProducts/:id', (req, res) => {
    OrderCartCollection.deleteOne({_id:req.params.id})
      .then((result) => {
        console.log(result)
        res.send(result.deletedCount > 0)
      })
  })

// Delete Card Product

app.get('/deleteCardProducts', (req, res) => {
  OrderCartCollection.deleteMany()
    .then((result) => {
      console.log(result)
      res.send(result.deletedCount > 0)
    })
})

// Card Product Update Quantity
  app.patch('/updateQuantity/:id', (req, res) => {
    console.log(req.params.id);
    OrderCartCollection.updateOne({'_id': req.params.id},
      {
        $set: { quantity: req.body.quantity}
      })
      .then(result => {
        res.send(result.modifiedCount > 0);
      })
  })
// Get Order Products

  app.get('/orderProducts',(req,res)=>{
    
    OrderCollection.find()
    .toArray((err,document)=>{
      res.send(document);
      err&&console.log(err);
    })
  })

  app.patch('/updateStatus/:id',(req,res)=>{
    console.log(req.params.id,req.body.status)
    OrderCollection.updateOne({_id:ObjectID(req.params.id)},
      {
        $set:{status:req.body.status}
      }).then(result=>{
        console.log(result.modifiedCount)
        res.send(result.modifiedCount>0)
      })
  })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})