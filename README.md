# Faith's Phonebook App
## Description

Faith's Phonebook App is a simple yet functional application that allows users to manage their contacts efficiently. The application is built using React and integrates with Apollo Client for GraphQL queries and mutations. The application is styled using the Chakra UI library and follows a dark theme as the initial color mode.

Checkout the Figma design here: https://www.figma.com/file/7MsqqtcnFbi00j2kv04akY/Phonebook-App?type=design&mode=design&t=RB8oKmhwVze9dGSA-1

## Installation

To set up the project locally, follow these steps:

    Clone the repository: git clone https://github.com/FaithL3S5/phonebook-app.git
    Navigate to the project directory: cd phonebook-app
    Install the dependencies: npm install
    Start the development server: npm start

## Scripts

    npm start: Starts the development server.
    npm build: Builds the application for production.
    npm test: Runs the test suite.
    npm eject: Ejects the setup scripts, allowing for custom configuration (use with caution).
    npm run lint: Lints the project files.
    npm run fix: Automatically fixes linting issues where possible.

## Features

The application offers the following features:

    Contact Management: Allows users to add, edit, and delete contacts.
    Phone Number Management: Allows users to add, edit, and delete phone numbers associated with a contact.
    Search Functionality: Enables users to search through their contact list.
    Responsive Design: The application is mobile-friendly and adapts to various screen sizes.

## File Structure
    Header/HeaderMobile.tsx: Defines the mobile version of the header, which includes the logo and navigation menu.
    
    PhoneContactList/PhoneContactList.tsx: Renders a list of phone contacts, fetching data from the GraphQL API and displaying it in a structured format.
    
    forms/ContactForm.tsx: Defines the form used to add or edit contacts, including fields for the contact's name and phone numbers.
    
    modal/DeleteConfirmationModal.tsx: Defines a modal for confirming contact deletion.
    
    modal/SetAsDefaultModal.tsx: Defines a modal that allows users to set a phone number as the default for a contact.
    
    graphql/apolloClient.ts: Sets up the Apollo Client for interactions with the GraphQL API.
    
    graphql/contact/fragments.ts: Defines reusable pieces of GraphQL queries.
    
    graphql/contact/mutations.ts: Defines GraphQL mutations for modifying data on the server.
    
    graphql/contact/queries.ts: Defines GraphQL queries for fetching data from the server.
    
    interfaces/GetContactListResponse.ts: Defines an interface for the response received when fetching the contact list.
    
    theme/theme.ts: Defines the theme for the application, including colors and styles.

## Dependencies

The project uses several dependencies, including:

    @apollo/client
    @chakra-ui/react
    @mui/material
    react
    typescript

## Contributing

Contributions to expand and improve the documentation are welcome!
