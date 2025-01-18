import React from 'react';
import { useQuery } from '@tanstack/react-query';

const fetchExampleData = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const ExamplePage: React.FC = () => {
  const { data, error, isLoading } = useQuery(['exampleData'], fetchExampleData);

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Example Page</h1>
      <h2>{data.title}</h2>
      <p>{data.body}</p>
    </div>
  );
};

export default ExamplePage;