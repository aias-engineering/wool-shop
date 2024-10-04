import Grid from ".";
import GridItem from "./item";

export default {
  title: 'molecules/grid',
  component: Grid
}

export const JustAGrid = () => (
  <Grid>
    {[1,2,3,4,5,6,7,8,9,10,11,12]
      .map(column => (<GridItem key={column}>Column {column}</GridItem>))
    }
  </Grid>
)

export const ColumnSpanGrid = () => (
  <Grid>
    {[2,10]
      .map((span, index) => (<GridItem key={index} columnSpan={span}>Spans {span}</GridItem>))
    }
  </Grid>
)