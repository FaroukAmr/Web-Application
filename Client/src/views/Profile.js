import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import axios from 'axios';
import '../css/profile.css';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
export default function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [gender, setGender] = useState('');
  const btn = {
    width: '20em',
    backgroundColor: '#2da44e',
    borderRadius: '6px',
  };
  const token = localStorage.getItem('authToken');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const handleGetUserInfo = async () => {
    await axios
      .get('/api/user', config)
      .then((res) => {
        setImage(res.data.data.image);
        setName(res.data.data.username);
        setEmail(res.data.data.email);
        if (res.data.data.gender) {
          setGender(res.data.data.gender);
        } else {
          setGender('male');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateUser = async () => {
    await axios
      .post('/api/user', { username: name, gender, image }, config)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleGetUserInfo();
  }, []);
  return (
    <Paper className="main-profile" style={{ backgroundColor: '#eee' }}>
      <Avatar
        alt={name.charAt(0)}
        src={image}
        sx={{ width: 56, height: 56 }}
        className="profile-avatar"
      >
        {name.charAt(0)}
      </Avatar>
      <TextField
        variant="standard"
        label="Name"
        style={{ minWidth: '100%' }}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        variant="standard"
        label="Email"
        style={{ minWidth: '100%' }}
        value={email}
        disabled
      />

      <FormControl>
        <FormLabel id="radio-buttons-group-label">Gender</FormLabel>
        <RadioGroup
          aria-labelledby="radio-buttons-group-label"
          value={gender.length > 0 ? gender : 'male'}
          name="radio-buttons-group"
          onChange={(e) => setGender(e.target.value)}
        >
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="female" control={<Radio />} label="Female" />
        </RadioGroup>
      </FormControl>

      <Button onClick={handleUpdateUser} variant="contained" style={btn}>
        Confirm
      </Button>
    </Paper>
  );
}
