# Project Context for GitHub Copilot

## Project Overview
This project is to help the hotels and home stays to manage their room booking and their customers documents in digital format. 
The application will allow hotel and home stay owners to manage their bookings, customer documents, and other related tasks efficiently.
The goal is to create a user-friendly interface for both hotel owners and customers, enabling easy access to booking information and document management.
# problem this project is solving
- Manage customers/visitors document in digital format and retrive it for the goverment rules and requirements, it will store documents for 5 year as per the regulations
- Hotel owners will be able to manager multiple properties with this app.
- Hotel owners will grant permissions to the hotel staff as per the suitability, e.g. some will be able add other users and manage, some will only be able to do the booking and manager visitors document.
- Once we have visitors document and assigned rooms, we will be able to communicate and manage/track their booking and create accounts too (not in focus for now).

## Architecture
- **Backend**: Supabase - we are using supbase as backend, we try to use supbase for everthing e.g. database, auth, authorization and storage.
When dealing with supbase related we need to make sure approach is correct and upto date. Make sure to document things.
For permissions we we use RLS policies on the table and this is tied to the role based approach.
we will be using storage for the documents keeping make sure to create the scalable fast and cost effective approach.
Supabase is used for 
- database 
- REST API via the JS-sdk 
- RLS policy for authorization and permissions
- Authentication
- Storage

- **Frontend**: There are 2 parts to it, 
1. we are creating dashboard for the internal team and hotel owners for manangent of properties and users and permissions kind of things.
2. We will create an mobile app using "React-Native" that will be used by the staff to make the visitor/user booking and document management.


## Technology Stack
- **Web**: [Add your web tech stack here: React/Vue/Angular, etc.]
- **Mobile**: [Add your mobile tech stack here: React Native/Flutter/etc.]

- **Backend**: Supabase
  - Authentication
  - Database
  - Storage
  - Functions
  - JS-sdk


- **Other Tools**: [List any other significant tools like state management libraries, UI frameworks, etc.]

## Key Features
- [List the main features of your application]

## Project Structure
- [Describe your project's folder structure and organization]

## Coding Conventions
- [Add coding conventions, patterns, or styles you want to maintain]

## Database Schema
- Database schema typescript types loaded from the supabase dashboard using `yarn run s:types`.
- schema file location : 'src/api/types.ts'
- same is using in the hooks and API that will be shared accross the web and mobile application.

## API Structure
- [Information about API endpoints and data flow]

## Common Patterns
- [Document any common patterns used in the codebase]

## Testing Strategy
- [How testing is done in the project]

## Deployment
- [Information about your deployment process]

## Additional Context
- [Any other information that would help Copilot assist you better]