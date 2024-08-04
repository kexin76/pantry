'use client';
import React, {useState, useEffect} from "react";
import { collection, addDoc, getDoc, QuerySnapshot, query, onSnapshot, deleteDoc, doc, setDoc, updateDoc} from "firebase/firestore"
import {db} from './firebase'
import { Box, Container, FormControl, InputLabel, Typography, Input, FormGroup, Button, OutlinedInput, Grid, List, ListItem, ListItemButton, Divider, ToggleButton, TextField,} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

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


  const [searchInput, setSearchInput] = useState("")
  const filteredItems = items.filter(item => item.name.toLowerCase().startsWith(searchInput.toLowerCase()));

  const [selectEdit, setSelectEdit] = useState(false)
  function clickEdit() {
    setSelectEdit(!selectEdit);
    console.log(selectEdit);
  };

  // Needs fixing
  const updateQuant = async (id, e) => {
    if(e != ""){
      await updateDoc(doc(db, "items", id), {
        quant: e
      });
    }

  }
  



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

            {/* Enter Item and Quanity. And Submit button */}
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
                
                <Button sx={{margin: 1}} onClick={addItem} typeof="submit" color="slate" variant="contained" > 
                  <Typography align="center" variant="h5" sx={{color:"#FFFFFF"}}>+</Typography> 
                </Button>
              </Box>
              
              {/* Search and Edit */}
              <Grid>
                <Grid py={1} px={2} >
                  <TextField value={searchInput || ""} onChange={(e) => {setSearchInput(e.target.value)}} label="Search" variant="filled" size="small" color="slate" sx={{bgcolor:"#a1a1aa", borderColor:"#a1a1aa", borderRadius:1,}} />
                  
                  {/* Make edit button functional */}
                  <ToggleButton onClick={clickEdit} sx={{bgcolor:"#166534", paddingX:3, py:1, float:"right"}}>
                    <Typography variant="h6">Edit</Typography> 
                  </ToggleButton>
                </Grid>
              </Grid>
              
              {/* Header for list */}
              <Box paddingTop={1} px={2} sx={{justifyContent:"space-between", display:"flex"}}>
                <Grid py={3/2} paddingLeft={2} paddingRight={1} bgcolor={"rgb(2 6 23)"} container spacing={0}>
                  <Grid xs={10}>
                        <Grid>Item Name</Grid>
                  </Grid>
                  <Grid xs={1} paddingRight={.5}>
                    <Grid sx={{float:"right"}}>Quantity</Grid>
                  </Grid>
                  <Grid xs={1}>
                    <Grid sx={{float:"right"}}>Delete</Grid>
                  </Grid>
                </Grid>
              </Box>
              
              <Divider sx={{marginX:2, bgcolor:"#cbd5e1" }} />
              
              {/* List all items */}
              <List sx={{paddingY:0}}>
                {filteredItems.map((item, id) => (
                  <>
                  <ListItem key={id} sx={{justifyContent:"space-between", display:"flex", paddingY:0}}>
                    <Box py={2.5} paddingLeft={2} paddingRight={3.5} width={"100%"} bgcolor={"rgb(2 6 23)"} display={"flex"} justifyContent={"space-between"}>
                      <Grid>
                        <Grid textTransform={"capitalize"}>{item.name}</Grid>
                      </Grid>

                      <Grid>
                        {selectEdit == false ? <Grid>{item.quant}</Grid> : 
                        // <TextField label="Search" variant="standard" size="small" color="slate" sx={{bgcolor:"#a1a1aa", borderColor:"#a1a1aa",}} />
                        <>
                          <label for="editQuant"></label>
                          {/* Needs fixing I think */}
                          <input type="text" id="editQuant" onChange={(e) => updateQuant(item.id, e)} placeholder={item.quant} className="bg-slate-700 rounded-md" />
                        </>
                        
                        }
                        
                      </Grid>
                    </Box>
                    <ListItemButton disableElevation sx={{bgcolor:"rgb(2 6 23)", borderLeft:2,  borderColor:"#0f172a", "&:not(:hover)":{bgcolor:"rgb(2 6 23)"} , "&:hover": {bgcolor:"#0f172a",}}} onClick={() => deleteItem(item.id)}>
                      <Box p={1.5}>
                        X
                      </Box>
                    </ListItemButton>
                  </ListItem>
                  <Divider component="li"sx={{marginX:2, bgcolor:"#475569"}} />
                  </>
                ))}
              </List>

              {/* Total amount of items */}
              {items.length < 1 ? ('') : (
                <div className="flex justify-between p-3">
                  <span>Total Amount of Items</span>
                  <span>{total}</span>
                  <span>{selectEdit}</span>
                </div>
              )}
            </Box>
          </Box>
        </Box>

      </Container>
    </ThemeProvider>

  );
}
