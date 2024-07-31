'use client';
import React, {useState, useEffect} from "react";
import { collection, addDoc, getDoc, QuerySnapshot, query, onSnapshot, deleteDoc, doc} from "firebase/firestore"
import {db} from './firebase'
import { Box, Container, FormControl, InputLabel, Typography, Input, FormGroup, Button, OutlinedInput} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue } from "@mui/material/colors";

export default function Home() {
  const [items, setItems] = useState([
    // {name: "Coffee beans", price: 10.00},
    // {name: "Popcorn", price: 13.75},
    // {name: "Candy", price: 5.50},
  ])
  const [newItem, setNewItem] = useState({name:"", amt:"", price:""});
  const [ total, setTotal] = useState(0);
  // Add item to firebase
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== '' && newItem.amt !== "" && newItem.price !== ''){
      // setItems([...items, newItem]);
      await addDoc(collection(db, 'items'), {
        name: newItem.name.trim(),
        amt: newItem.amt,
        price: newItem.price,

      });
      setNewItem({name:"", amt:"", price: ""});
    }
  };

  // Read items from database
  useEffect(() =>{
    const q = query(collection(db, "items"))
    const unsubscribe = onSnapshot(q, (QuerySnapshot)=>{
      let itemsArr = [];

      QuerySnapshot.forEach((doc) => {
        itemsArr.push({...doc.data(), id:doc.id})
      });
      setItems(itemsArr);
      
      // Read total from itemsArr
      const calculateTotal = () => {
        const totalPrice = itemsArr.reduce((sum,item) => sum + parseFloat(item.price*item.amt), 0);
        setTotal(totalPrice);
      };
      calculateTotal();
      return () => unsubscribe();
    });
  }, []);

  // Delete items from database
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "items", id));
  };

  // Theme / Color Maker
  const { palette } = createTheme();
  const { augmentColor } = palette;
  const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
  const theme = createTheme({
    palette: {
      slate: createColor("rgb(2 6 23)"),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ height: "100vh"}}>
        <Box display="flex" sx={{flexDirection: "column", align: "center", p:10}}>
          <Box maxWidth={"64 rem"} fontSize={14} sx={{alignItems: "center", fontFamily: "monospace", justifyContent: "space-between", width:"100%"}}>
            <Typography align="center" variant="h2" sx={{fontFamily: "Segoe UI Emoji",}}>Pantry</Typography>
            <br/><br/>
            <Box padding={2} bgcolor={"#708090"} sx={{borderRadius: 2,}}>
              <Box display="flex">
                <FormControl sx={{color: "black", flexGrow: 1}}>
                    <InputLabel sx={{shrink: true,}} htmlFor="input-item" type="text">Enter Item</InputLabel>
                    <OutlinedInput id="input-item" sx={{
                      "&:not(:hover) .MuiOutlinedInput-notchedOutline" : {borderColor:"black"},
                      "&:hover > .MuiOutlinedInput-notchedOutline" :{borderColor: "black"},
                      }} label="Enter Item" value={newItem.name || ""} onChange={(e) => setNewItem({...newItem, name:e.target.value})} type="text"/>
                </FormControl>

                <FormControl sx={{color: "black", flexGrow: 1}}>
                    <InputLabel htmlFor="input-amt" id="outlined-basic" type="number">Enter Amount</InputLabel>
                    <Input sx={{margin:1}} id="input-amt" value={newItem.amt || ""} onChange={(e) => setNewItem({...newItem, amt:e.target.value})} type="number"></Input>
                </FormControl>
                
                <FormControl sx={{color:"black", flexGrow:1}}>
                    <InputLabel html="input-cost" type="number">Enter Cost</InputLabel>
                    <Input sx={{margin:1}} id="input-cost" value={newItem.price || ""} onChange={(e) => setNewItem({...newItem, price:e.target.value})} type="number"></Input>
                </FormControl>

                <Button onClick={addItem} typeof="submit" color="slate" variant="contained" > <Typography align="center" variant="h5" sx={{color:"#FFFFFF"}}>+</Typography> </Button>
              </Box>
              
              <ul>
                {items.map((item, id) => (
                  <li key={id} className="my-4 w-full flex justify-between bg-slate-950">
                    <div className="p-4 w-full flex justify-between">
                      <span className="capitalize">{item.name}</span>
                      <span>{item.amt}</span>
                      <span>${item.price}</span>
                    </div>
                    <button onClick={() => deleteItem(item.id)} className="ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16">X</button>
                  </li>
                ))}
              </ul>
              {items.length < 1 ? ('') : (
                <div className="flex justify-between p-3">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              )}
            </Box>
          </Box>
        </Box>
      <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
          <Typography align="center" variant="h2" sx={{fontFamily: "Segoe UI Emoji",}}>Pantry</Typography>
          <br/><br/>
          <div className="bg-slate-800 p-4 rounded-lg">
            <form className="grid grid-cols-6 items-center text-black">
              <input value={newItem.name} onChange={(e) => setNewItem({...newItem, name:e.target.value})} classname="col-span-3 p-3 border" type="text" placeholder="enter item" />
              <input value={newItem.price} onChange={(e) => setNewItem({...newItem, price:e.target.value})} classname="col-span-2 p-3 border mx-3" type="number" placeholder="enter price $" />
              <button onClick={addItem} className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl" typeof="submit">+</button>
            </form>
            <ul>
              {items.map((item, id) => (
                <li key={id} className="my-4 w-full flex justify-between bg-slate-950">
                  <div className="p-4 w-full flex justify-between">
                    <span className="capitalize">{item.name}</span>
                    <span>${item.price}</span>
                  </div>
                  <button onClick={() => deleteItem(item.id)} className="ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16">X</button>
                </li>
              ))}
            </ul>
            {items.length < 1 ? ('') : (
              <div className="flex justify-between p-3">
                <span>Total</span>
                <span>${total}</span>
              </div>
            )}
          </div>
        </div>
      </main>      

      </Container>
    </ThemeProvider>

  );
}
