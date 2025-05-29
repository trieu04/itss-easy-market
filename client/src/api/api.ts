import axios from 'axios';

export const getData = async () => {
  const res = await axios.get('http://localhost:3000/swagger');
  return res.data;
};

//some change
