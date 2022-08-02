import Header from '../../components/Header'
import { client , urlFor} from '../../sanity'
import { Post } from '../../typing'
import PortableText from "react-portable-text"
import { useForm , SubmitHandler} from "react-hook-form"
import { useState } from 'react'


interface Props {
    post : Post //This will define the type as Post after : colon 
}

interface IForm {
    _id : string ,
    name : string ,
    email : string ,
    comment : string 
}



//after : is used for type 
function Post ({post } : Props) {
    console.log(post)
    const [submitted , setSubmitted] = useState(false)
    const {register , 
     handleSubmit ,
    formState: {errors} ,
} = useForm<IForm>();
 
 
  const onSubmit: SubmitHandler<IForm> = async (data) => {
    console.log(data);

    await fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data);
        setSubmitted(true)
       
      })
      .catch((err) => {
        console.log(err);
        setSubmitted(false)
      
      });
  };

 
  return (
      <main>
          <Header />
          <img  className="h-40 w-full object-cover" src={urlFor(post.mainImage).url()} alt="" />
           <article className='max-w-3xl mx-auto p-5'>
               <h1 className="text-3xl mt-10 mb-3">
                  this is sick
               </h1>
               <h2 className='text-xl font-light text-gray-500 mb-2'>

                   {post.description}
               </h2>

               <div className='flex items-center space-x-2'>
                   <img className="h-10 w-10 rounded-full" src={urlFor(post.mainImage).url()} alt="" />
                   <p className='font-extralight text-sm'>
                       Blog Post By <span className='text-yellow-600'>{post.author.name}</span> published At{" "} 
                       {new Date(post._createdAt).toLocaleString()}
                   </p>
               </div>
               <div className='mt-10'>

                   <PortableText 
                    dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
                    projectId = {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                    content={post.body}
                    serializers = {
                        {
                        h1 : (props : any) => (
                       <h1 className='text-2xl font-bold my-5 text-green'{...props} />
                        ),
                        h4 : (props : any )=>(
                       <h4 className='text-xl font-sans my-5 text-green' {...props}/>
                        ),
                        li : ({children }: any )=>(
                            <li className="ml-4 list-disc" >{children} </li>
                        ),
                        link : ({href , children } : any )=>(
                            <a href={href} className="text-blue-500 hover:underline">
                                {children}
                            </a>
                        )
                     }    
                    }         
                   />
               </div>
           </article>

           <hr className='max-w-lg my-5 mx-auto border  border-yellow-500'/>

           {submitted ? (
               <div className='flex flex-col  rounded 
                bg-yellow-500 max-w-2xl py-10 my-10 px-5 mx-auto text-white'>
                 <h3 className='text-3xl font-bold'>Thank you For Submitting </h3>
                 <p>Once it has been Approved it will show</p>
               </div>
               
           ) : 
           ( 
                <form  onSubmit={handleSubmit(onSubmit)} className='flex flex-col max-w-2xl mx-auto mb-10'>

               <h3 className="text-sm text-yellow-500">Enjoyed this article</h3>
               <h4 className='text-2xl font-bold'>Leave a Comment </h4>
               <hr className='py-3 mt-2'/>
               
               <input {...register("_id")} 
               type="hidden" 
               name="_id"
               value={post._id}
               />

               <label className='block mb-5' >
                   <span className='text-gray-700'>Name </span>
                   <input {...register("name" , {required : true}) } className='shadow border rounded py-2 block px-3 
                   form-input mt-1 w-full ring-yellow-500 outline-none focus:ring' placeholder = "Piyush Tadiyal" type="text" />
               </label>

                 <label className='block mb-5' >
                   <span className='text-gray-700'>Email  </span>
                   <input {...register("email" ,{required : true})} className='shadow border rounded py-2 block w-full mt-1 form-input
                   outline-none focus:ring px-3' placeholder="abc@gmail.com" type="email" />
               </label>

                 <label className='block mb-5'>
                   <span>Comment</span>
                   <textarea  {...register("comment" , {required : true})} className='shadow border rounded block w-full form-textarea
                   px-3 mt-1 py-2 outline-none focus:ring' placeholder="piyush tadiyal"  rows={8}/>
               </label>

               <div className ="flex flex-col p-5" >
                   {errors.name   && (
                   <span className='text-red-500'>-- The Name Field is Empty </span>)}
                   {errors.email && (
                       <span className='text-red-500'>--The email field is Empty  </span>
                   )}
                   {errors.comment && (
                       <span className='text-red-500' >
                           --The Comment Field is Empty 
                       </span>
                   )}
               </div>

               <button  className="shadow rounded w-full bg-yellow-500
               hover:bg-yellow-400 focus:outline-none focus:shadow-outline
               text-white font-bold py-2 px-4 cursor-pointer"  type='submit'>Submit</button>
           </form>
           )}
            <div className='flex flex-col max-w-2xl mx-auto p-10 my-10
            shadow-yellow-500 shadow space-y-2' >
                <h3 className="text-full font-mono font-bold "> Comments</h3>
                <hr className='pb-2' />
            {
                post.comments.map((comment) =>{
                    return (
                     <div key={comment._id}>
                         <p className='text-yellow-500 '>
                            <span className=' text-black font-sans '>{comment.name}: </span> {comment.comment}
                         </p>
                    </div>
                    )})}
            </div>
     </main>
  )
}

export default Post 

export async function getStaticPaths() {
  const paths = await client.fetch(

    `*[_type == "post"]{
        _id, slug {
             current
        }
    }`
  )  
  
  return {
   paths : paths.map((post : Post ) =>({
      params: { slug :  post.slug.current }})),
    fallback: "blocking",
  }
}

export async function getStaticProps({params }) {
  // It's important to default the slug so that it doesn't return "undefined"
  const post = await client.fetch(`
    *[_type == "post" && slug.current == $slug][0]{ _id, _createdAt,title,author->{
        name,
        image,
         },
         "comments": *[_type == "comment" && 
        post._ref == ^._id && 
         approved == true  ],
         description,
         mainImage,
         slug,
         body
    }`, { slug : params?.slug })

   if(!post ){
       return {
            notFound : true
       }
   }
  return {
    props: {  post }, 
    revalidate : 60, // it will update after 60 seconds bring server side page render  
  }
}

//Image result
//A slug is a unique string (typically a normalized version of title or other representative string), often used as part of a URL. * 
