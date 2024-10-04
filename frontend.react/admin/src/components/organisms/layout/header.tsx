import Title from "../../atomics/title";
import Grid from "../../molecules/grid";
import GridItem from "../../molecules/grid/item";
import Header from "../../molecules/header";

const HeaderLayout = () => (
  <Header>
    <Grid>
      <GridItem columnSpan={2}>
        <Title>Naqab Bedouin Design</Title>
      </GridItem>
      <GridItem columnSpan={10}>
        <Grid>
          <GridItem columnSpan={12}>
            <Title as="h2">Administration UI</Title>
          </GridItem>
          <GridItem columnSpan={2}>
          </GridItem>
        </Grid>
      </GridItem>
    </Grid>
  </Header>
)

export default HeaderLayout