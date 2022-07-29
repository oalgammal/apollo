import Head from 'next/head'
import Image from 'next/image'
import Characters from '../components/Characters'
import {useState} from 'react'
import styles from '../styles/Home.module.css'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { Heading,Box,Flex,Input,Stack,IconButton,useToast} from '@chakra-ui/react'
import {SearchIcon,CloseIcon} from "@chakra-ui/icons";

export default function Home({results}) {
  const intialState =results
  const [characters,setCharacters]= useState(intialState)
  const [search,setSearch]= useState('')
  return (
    <Flex direction = "column" justify='center' align='center'>
    <Box mb={4} flexDirection ='column' align='center' py={8} justify='center'>
      <Heading as='h1' size='2xl' mb={8}>Rick and Morty</Heading>
      <form onSubmit={async(event)=>{
        event.preventDefault()
        const res= await fetch("/api/SearchChars",{
          method:"post",
          body:search
        })
        const{results,error}=await res.json();
        if(error){
          alert(error)
          setSearch('')
        }else{setCharacters(results)}
      }} >
        <Stack maxWidth="350px" width="100%" isInline mb={8}>
          <Input placeholder="Search" value={search} onChange={(e)=>{setSearch(e.target.value)}}/>
          <IconButton colorScheme="blue" arial-lable="Search" icon={<SearchIcon/>} disabled={search===""} type="submit" />
          <IconButton colorScheme="red" arial-lable="Reset" icon={<CloseIcon/>} disabled={search===""} 
          onClick={async()=>{
            setSearch("")
            setCharacters(intialState)
        }} />
        </Stack>
      </form>
      <Characters characters={characters} border="none" onChange={(e)=>setSearch(e.target.value)}/>
    </Box>
    </Flex>
  )
}


export async function getStaticProps() {  
  const client = new ApolloClient({
    uri:"https://rickandmortyapi.com/graphql/",
    cache: new InMemoryCache(),
  })
  const {data}= await client.query({
    query:gql`
      query{
        characters(page:1){
          info{
            count
            pages
          }
          results{
            name
            id
            location{
              id
              name
            }
            origin{
              id
              name
            }
            episode{
              id
              episode
              air_date
            }
            image
          }
        }
      }
    `
  })
  return{
    props:{
      results: data.characters.results
    }
  }
  // body...
}