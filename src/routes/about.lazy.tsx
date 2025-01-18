import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const Route = createLazyFileRoute('/about')({
  component: About,
})

function About() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    getCountries();
  }, []);

  async function getCountries() {
    const { data } = await supabase.from("organizations").select();
    console.log(data);
    setCountries(data);
  }

  return (
    <ul>
      {countries.map((country) => (
        <li key={country.name}>{country.name}</li>
      ))}
    </ul>
  );
}