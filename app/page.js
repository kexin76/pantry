'use client';
import React, {useState, useEffect} from "react";
import { collection, addDoc, getDoc, QuerySnapshot, query, onSnapshot, deleteDoc, doc, setDoc, updateDoc} from "firebase/firestore"
import {db} from './firebase'
import { Box, Container, FormControl, InputLabel, Typography, Input, FormGroup, Button, OutlinedInput, Grid, List, ListItem, ListItemButton, Divider, ToggleButton, TextField, colors,} from "@mui/material";
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
  };

  // Needs fixing
  const updateQuant = async (id, quant) => {
    if(quant != "" && quant != null){
      await updateDoc(doc(db, "items", id), {
        quant: quant
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
      <Box sx={{bgcolor:"#392C29"}}>
      <Container sx={{ height: "100vh",}}>
        <Box display="flex" sx={{flexDirection: "column", align: "center", p:10,}}>
          <Box maxWidth={"64 rem"} fontSize={14} sx={{alignItems: "center", fontFamily: "monospace", justifyContent: "space-between", width:"100%",}}>
            <Typography align="center" variant="h2" sx={{fontFamily: "Segoe UI Emoji", color:"#D9F3EF"}}>Pantry</Typography>
            <br/><br/>

            {/* Enter Item and Quanity. And Submit button */}
            <Box padding={2} bgcolor={"#7A4F44"} sx={{borderRadius: 2,}}>
              <Box display="flex">
                <FormControl sx={{ flexGrow: 1, margin: 1}}>
                    <InputLabel style={{ color: 'black' }}  sx={{shrink: true,}} htmlFor="input-item" type="text">Enter Item</InputLabel>
                    <OutlinedInput id="input-item" sx={{
                      "&:not(:hover) > .MuiOutlinedInput-notchedOutline" : {borderColor:"black"},
                      "&:hover > .MuiOutlinedInput-notchedOutline" :{borderColor: "black"},
                      }} label="Enter Item" value={newItem.name || ""} onChange={(e) => setNewItem({...newItem, name:e.target.value.toLowerCase()})} type="text"/>
                </FormControl>

                <FormControl sx={{color: "black", flexGrow: 1, margin: 1}}>
                    <InputLabel style={{ color: 'black' }}  sx={{shrink: true,}} htmlFor="input-amt" type="number">Enter Quantity</InputLabel>
                    <OutlinedInput sx={{
                      "&:not(:hover) > .MuiOutlinedInput-notchedOutline" : {borderColor:"black"},
                      "&:hover > .MuiOutlinedInput-notchedOutline" :{borderColor: "black"},
                      }} id="input-amt" label="Enter Quantity" value={newItem.quant || ""} onChange={(e) => setNewItem({...newItem, quant:e.target.value})} type="number"></OutlinedInput>
                </FormControl>
                
                <Button sx={{margin: 1, bgcolor:"#292026"}} onClick={addItem} typeof="submit" color="slate" variant="contained" > 
                  <Typography align="center" variant="h5" sx={{color:"#FFFFFF"}}>+</Typography> 
                </Button>
              </Box>
              
              {/* Search and Edit */}
              <Grid>
                <Grid py={1} px={2} >
                  <TextField value={searchInput || ""} onChange={(e) => {setSearchInput(e.target.value)}} label="Search" variant="filled" size="small" color="slate" sx={{bgcolor:"#C5D2AE", borderColor:"#292026", borderRadius:1,}} />
                  
                  {/* Make edit button functional */}
                  <ToggleButton onClick={clickEdit} sx={{bgcolor:"#95A070", "&:hover":{bgcolor: "#C5D2AE"}, paddingX:3, py:1, float:"right"}}>
                    <Typography variant="h6">Edit</Typography> 
                  </ToggleButton>
                </Grid>
              </Grid>
              
              {/* Header for list */}
              <Box paddingTop={1} px={2} sx={{justifyContent:"space-between", display:"flex"}}>
                <Grid py={3/2} paddingLeft={2} paddingRight={1} bgcolor={"#546A4D"} color={"#D9F3EF"} container spacing={0}>
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
                    <Box color={"#D9F3EF"} py={2.5} paddingLeft={2} paddingRight={3.5} width={"100%"} bgcolor={"#292026"} display={"flex"} justifyContent={"space-between"}>
                      <Grid>
                        <Grid textTransform={"capitalize"}>{item.name}</Grid>
                      </Grid>

                      <Grid>
                        {selectEdit == false ? <Grid>{item.quant}</Grid> : 
                          <input type="number" id="editQuant" onChange={(e) => updateQuant(item.id, e.target.value)} placeholder={item.quant} className="bg-slate-700 rounded-md w-14 placeholder: text-center " />
                        }
                        
                      </Grid>
                    </Box>
                    <ListItemButton disableElevation sx={{ borderLeft:2,  borderColor:"#0f172a", "&:not(:hover)":{bgcolor:"#292026"} , "&:hover": {bgcolor:"#3e363b",}}} onClick={() => deleteItem(item.id)}>
                      <Box color={"#D9F3EF"} p={1.5}>
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
                <Box py={2.5} px={2}>
                  <Box padding={2} sx={{display: "inline-flex", bgcolor:"rgb(0 0 0)", borderRadius: 3, bgcolor:"#546A4D"}} justifyContent={"space-between"}>
                    <Box>Total Amount of Items:</Box>
                    <Box pl={2}>{total}</Box>
                    
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

      </Container>
      </Box>
    </ThemeProvider>

  );
}
