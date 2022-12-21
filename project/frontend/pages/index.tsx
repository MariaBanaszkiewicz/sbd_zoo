import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Layout from '../components/Layout'

const inter = Inter({ subsets: ['latin'] })

const Home = (): React.ReactElement => <></>;

Home.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default Home;
