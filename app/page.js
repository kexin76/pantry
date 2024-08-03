'use client';
import React, {useState, useEffect} from "react";
import { collection, addDoc, getDoc, QuerySnapshot, query, onSnapshot, deleteDoc, doc} from "firebase/firestore"
import {db} from './firebase'
import { Box, Container, FormControl, InputLabel, Typography, Input, FormGroup, Button, OutlinedInput, Grid, List, ListItem,} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue } from "@mui/material/colors";

export default function Home() {
  const [items, setItems] = useState([
  ])
  const [newItem, setNewItem] = useState({name:"", quant:""});
  const [ total, setTotal] = useState(0);
  // Add item to firebase
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== '' && newItem.quant !== ""){
      // setItems([...items, newItem]);
      await addDoc(collection(db, 'items'), {
        name: newItem.name.trim(),
        quant: newItem.quant,

      });
      setNewItem({name:"", quant:""});
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
        const totalAmount = itemsArr.reduce((sum,item) => sum + parseFloat(item.quant), 0);
        setTotal(totalAmount);
      };
      calculateTotal();
      return () => unsubscribe();
    });
  }, []);

  // Delete items from database
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "items", id));
  };

  const updateItem = async (id) => {

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
                <FormControl sx={{color: "black", flexGrow: 1, margin: 1}}>
                    <InputLabel style={{ color: 'black' }}  sx={{shrink: true,}} htmlFor="input-item" type="text">Enter Item</InputLabel>
                    <OutlinedInput id="input-item" sx={{
                      "&:not(:hover) > .MuiOutlinedInput-notchedOutline" : {borderColor:"black"},
                      "&:hover > .MuiOutlinedInput-notchedOutline" :{borderColor: "black"},
                      }} label="Enter Item" value={newItem.name || ""} onChange={(e) => setNewItem({...newItem, name:e.target.value})} type="text"/>
                </FormControl>

                <FormControl sx={{color: "black", flexGrow: 1, margin: 1}}>
                    <InputLabel style={{ color: 'black' }}  sx={{shrink: true,}} htmlFor="input-amt" type="number">Enter Quantity</InputLabel>
                    <OutlinedInput sx={{
                      "&:not(:hover) > .MuiOutlinedInput-notchedOutline" : {borderColor:"black"},
                      "&:hover > .MuiOutlinedInput-notchedOutline" :{borderColor: "black"},
                      }} id="input-amt" label="Enter Quantity" value={newItem.quant || ""} onChange={(e) => setNewItem({...newItem, quant:e.target.value})} type="number"></OutlinedInput>
                </FormControl>
                

                <Button sx={{margin: 1}} onClick={addItem} typeof="submit" color="slate" variant="contained" > <Typography align="center" variant="h5" sx={{color:"#FFFFFF"}}>+</Typography> </Button>
              </Box>
              {/* Need to finish TABS*/}
              <Box>
                SHOWS TABS
              </Box>
              <List>
                {items.map((item, id) => (
                  <ListItem key={id} item sx={{justifyContent:"space-between"}}>
                    <Box p={2} width={"100%"} bgcolor={"rgb(2 6 23)"} display={"flex"} justifyContent={"space-between"}>
                      <Grid item xs={8}>
                        <Grid textTransform={"capitalize"}>{item.name}</Grid>
                      </Grid>
                      <Grid item xs={2}>
                        <Grid>{item.quant}</Grid>
                      </Grid>
                      
                    </Box>
                    {/* FIX SIZING */}
                    <Button  sx={{borderLeft:2, borderColor:"#0f172a", "&:not(:hover)":{bgcolor:"rgb(2 6 23)"} , "&:hover": {bgcolor:"#0f172a",}}} disableElevation variant="contained" onClick={() => deleteItem(item.id)}>
                      <Typography align="center" sx={{color:"white"}}>X</Typography>
                    </Button>
                  </ListItem>
                  
                ))}
              </List>
              
                

              {items.length < 1 ? ('') : (
                <div className="flex justify-between p-3">
                  <span>Total Amount of Items</span>
                  <span>{total}</span>
                </div>
              )}
            </Box>
          </Box>
        </Box>

      </Container>
    </ThemeProvider>

  );
}
