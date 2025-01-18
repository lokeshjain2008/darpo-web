/* eslint-disable @typescript-eslint/no-explicit-any */
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { useDatabase } from '@/hooks/useDatabase';

export const Route = createLazyFileRoute('/about')({
  component: About,
})

function About() {
  const [countries, setCountries] = useState<any[]>([]);
  const { data, fetchData } = useDatabase('organizations');
  console.log(data);
  console.log(fetchData);

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