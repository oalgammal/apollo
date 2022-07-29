// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
const client = new ApolloClient({
    uri:"https://rickandmortyapi.com/graphql/",
    cache: new InMemoryCache(),
  })
export default async (req, res)=>{
  const search = req.body
  try{
    const {data} = await client.query({
      query:gql`
              query{
                characters(filter:{name:"${search}"}){
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
    if (data.characters.results.length===0){throw error}else{
    res.status(200).json({results:data.characters.results})
    }
  }catch(error){
  
      res.status(404).json({results:null,error:"No Character Found, please try again"})

  }
}
