import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Home, Storage, TableChart } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { ListSubheader } from "@mui/material";
import { Link } from "react-router-dom";

export default function SideNavbar(props) {
  const { showSideNavbar, handleClose } = props;
  const dbInfo = useSelector((state) => state.db);
  const tableNavLinks =
    Array.isArray(dbInfo?.metadata) &&
    dbInfo.metadata.map((table_info) => {
      return {
        label: table_info.name,
        link: `db/${dbInfo.id}/table/${table_info.name}`,
      };
    });

  const navLinks = [
    { label: "Home", icon: <Home />, link: "/" },
    { label: "Select DB", icon: <Storage />, link: "/dbconnect/" },
  ];

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {Array.isArray(navLinks) &&
          navLinks.map((navItem, index) => (
            <Link to={navItem.link} key={`navItem-${index}`}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>{navItem.icon}</ListItemIcon>
                  <ListItemText primary={navItem.label} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
      </List>
      <Divider />
      <List>
        <ListSubheader>Tables</ListSubheader>
        {Array.isArray(tableNavLinks) &&
          tableNavLinks.map((navItem, index) => (
            <Link to={navItem.link} key={`navItem-${index}`}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>{<TableChart />}</ListItemIcon>
                  <ListItemText primary={navItem.label} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      <Drawer open={showSideNavbar} onClose={handleClose}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
