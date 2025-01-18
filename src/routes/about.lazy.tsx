/* eslint-disable @typescript-eslint/no-explicit-any */
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const Route = createLazyFileRoute('/about')({
  component: About,
})

function About() {
  const [countries, setCountries] = useState<any[]>([]);

  useEffect(() => {
    getCountries();
  }, []);

  async function getCountries() {
    const { data } = await supabase.from("organizations").select();
    console.log(data);
    if (data) {
      setCountries(data);
    }
  }

  return (
    <ul>
      {countries.map((country) => (
        <li key={country.name}>{country.name}</li>
      ))}
    </ul>
  );
}