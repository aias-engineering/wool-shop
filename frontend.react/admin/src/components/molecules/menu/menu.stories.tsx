import Link from "../../atomics/link/Link";
import Menu from ".";
import MenuItem from "./item";
import Grid from "../grid";
import MenuHeader from "./header";
import GridItem from "../grid/item";
import Title from "../../atomics/title";

export default {
    title: "molecules/menu",
    component: Menu,
  };

export const JustAMenu = () => (
  <Menu>
    <MenuItem>
      <Link to={"./#"}>Create Products</Link>
    </MenuItem>
    <MenuItem>
      <span>Other Menu Item</span>
    </MenuItem>
    <MenuItem>
      <span>And another one</span>
    </MenuItem>
  </Menu>
)

export const MenuInAGrid = () => (
  <Grid>
    <GridItem columnSpan={3}>
      <Menu>
        <MenuHeader>
          <Title>
            Naqab Bedouin Design
          </Title>
        </MenuHeader>
        <MenuItem>
          <Link to={"./#"}>Create Products</Link>
        </MenuItem>
        <MenuItem>
          <span>Other Menu Item</span>
        </MenuItem>
        <MenuItem>
          <span>And another one</span>
        </MenuItem>
      </Menu>
    </GridItem>
  </Grid>
)