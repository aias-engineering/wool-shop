import Header from ".";
import Title from "../../atomics/title";
import HeaderContent from "./content";
import HeaderTitle from "./title";

export default {
  title: 'molecules/header',
  component: Header
}

export const JustAHeader = () => (
  <>
    <Header>
      <HeaderTitle>
        <Title>Naqab Bedouin Design</Title>
      </HeaderTitle>
      <HeaderContent>
        Administration UI
      </HeaderContent>
    </Header>
  </>
)