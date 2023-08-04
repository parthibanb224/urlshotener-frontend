import React, { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useUser } from '../context/Users.context';
import axios from 'axios';
import CopyToClipboard from "react-copy-to-clipboard";
import { Link } from 'react-router-dom';

export default function Dashboard() {

  const [url, serUrl] = useState("");
  const [createShortenUrl, setCreateShortenUrl] = useState("");
  const { signinUser, setSigninUser, userShortenUrl, setUserShortenUrl } = useUser();
  const [loading,setLoading] = useState("false");

  useEffect(() => {
    let token = JSON.parse(sessionStorage.getItem("Token"));
    setSigninUser(token.name)
  }, [])

  const handleUrl = async (e) => {
    e.preventDefault();
    setLoading("true");
    try {
      const response = await fetch(
        `https://api.shrtco.de/v2/shorten?url=${url}`
      )
      const data = await response.json();
      setCreateShortenUrl(data.result.full_short_link);
      const URL = process.env.NODE_ENV === 'development' ? `${process.env.REACT_APP_DEV_URL_FOR_BACKEND}/shortenUrl/${signinUser}` : `${process.env.REACT_APP_PRO_URL_FOR_BACKEND}/shortenUrl/${signinUser}`;
      axios.patch(URL, { shortenUrl: data.result.full_short_link })
        .then(response => {
          let userShortenUrlCopy = [...userShortenUrl]
          userShortenUrlCopy.push(data.result.full_short_link)
          setUserShortenUrl(userShortenUrlCopy);
        })
        .catch(err => {
          console.log(err)
        })

    } catch (e) {
      alert(e);
    }
  };


  return (
    <div>
      <h1>welcome {signinUser}</h1>
      <div className='text-center'><Link to='/userActivities'><Button>Your Activities</Button></Link></div>
      <h2 className='mt-5'>URL SHORTENER</h2>
      <Form className='mt-3 mb-3' onSubmit={handleUrl}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Control type="text" placeholder="Enter Link Here" onChange={e => serUrl(e.target.value)} />
        </Form.Group>
        <div className='text-center'>
          <Button variant="primary" type="submit">Shorten Link</Button>{' '}
        </div>
        <div>
          {createShortenUrl.length > 0 ?
            <div>
              <Form.Group className="mt-4" controlId="exampleForm.ControlInput2">
                <Form.Control className='text-center' type="text" value={createShortenUrl} />
              </Form.Group>
              <CopyToClipboard text={createShortenUrl}>
                <div className='text-center'><Button className="border-1 border-blue-500 text-blue-500 font-medium rounded-md">Copy URL to Clipboard</Button>{' '}</div>
              </CopyToClipboard>
            </div>
            : loading === "true" ? <p style={{color:"red"}}>Loading...</p> : "" }
        </div>
      </Form>
    </div>
  )
}
