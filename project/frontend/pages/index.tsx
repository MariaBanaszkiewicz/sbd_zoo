import { Flex, SimpleGrid } from "@chakra-ui/react"
import { Inter } from '@next/font/google'
import Layout from '../components/Layout'
import Tile from '../components/Tile'
import BreadCrumb from "../components/Breadcrumb"

const inter = Inter({ subsets: ['latin'] })

const Home = (): React.ReactElement => <>
<BreadCrumb breadcrumb={[{label: "Pulpit", isCurrentPage: true, href:"/"}]}/>
        
<Flex justifyContent="center">
<SimpleGrid columns={2} justifyContent="center" alignItems="center" w={530}>
    <Tile text="ZWIERZĘTA" href="/animals"/>
    <Tile text="PRACOWNICY" href="/employees"/>
    <Tile text="ZAGRODY" href="/pens"/>
    <Tile text="ZESPOŁY" href="/teams"/>
</SimpleGrid>
</Flex></>;

Home.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default Home;
