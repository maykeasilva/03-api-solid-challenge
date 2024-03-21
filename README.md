# Module challenge: API Node.js with SOLID

In this challenge we will develop an API for animal adoption, the Find a Friend API. This project is part of the learning process and is not a production-ready application.

## Setup
- Clone the repository;
- Install dependencies (`npm install`);
- Setup PostgreSQL (`docker compose up -d`);
- Copy `.env.example` file (`cp .env.example .env`);
- Run application (`npm run dev`);
- Test it! (I personally recommend testing with [Hoppscotch](https://hoppscotch.io/) or [Bruno API Client](https://www.usebruno.com/));

## HTTP

### POST `/orgs`

Create a new organization.

#### Request body
```json
{
    "name": "John Doe Organization",
    "personResponsible": "John Doe",
    "email": "johndoe@example.com",
    "password": "123456",
    "whatsapp": "(32)99900-1100",
    "cep": "30130-005",
    "state": "MG",
    "city": "Belo Horizonte",
    "street": "Av. Afonso Pena",
    "neighborhood": "Centro",
    "number": "999",
    "latitude": -19.924937,
    "longitude": -43.934905
}
```

### POST `/orgs/sessions`

Authenticate a organization.

#### Request body
```json
{
    "email": "johndoe@example.com",
    "password": "123456"
}
```

#### Response body
```json
{
    "token": "[...]"
}
```

### POST `/orgs/pets`

Register a new pet. ( **_Authentication required_** )

Accepted values:
- Age: puppy, adult, elderly;
- Size: small, medium, big;
- Energy Level: very low, low, medium, high, very high;
- Independence Level: low, medium, high;
- Environment: small, medium, big;

#### Request body
```json
{
    "name": "Ruby",
    "about": "More about the pet.",
    "age": "puppy",
    "size": "small",
    "energyLevel": "high",
    "independenceLevel": "low",
    "environment": "small"
}
```

### GET `/orgs/:orgId`

Return data from a single organization.

#### Response body
```json
{
    "id": "88596954-9a28-4e0b-9619-8455fe17908c",
    "name": "John Doe Organization",
    "personResponsible": "John Doe",
    "email": "johndoe@example.com",
    "whatsapp": "(32)99900-1100",
    "cep": "30130-005",
    "state": "MG",
    "city": "Belo Horizonte",
    "street": "Av. Afonso Pena",
    "neighborhood": "Centro",
    "number": "999",
    "complement": null,
    "latitude": "-19.924937",
    "longitude": "-43.934905",
    "createdAt": "2024-03-20T18:14:49.617Z"
}
```

### GET `/orgs/nearby`

Return data from nearby organizations.

#### Request query
```json
{
    "userLatitude": -19.924558,
    "userLongitude": -43.935368
}
```

#### Response body
```json
{
    "orgs": [
        {
            "id": "88596954-9a28-4e0b-9619-8455fe17908c",
            "name": "John Doe Organization",
            "person_responsible": "John Doe",
            "email": "johndoe@example.com",
            "whatsapp": "(32)99900-1100",
            "cep": "30130-005",
            "state": "MG",
            "city": "Belo Horizonte",
            "street": "Av. Afonso Pena",
            "neighborhood": "Centro",
            "number": "999",
            "complement": null,
            "latitude": "-19.924937",
            "longitude": "-43.934905",
            "created_at": "2024-03-20T18:14:49.617Z"
        }
    ]
}
```

### GET `/pest/:petId`

Return data from a single pet.

#### Response body
```json
{
    "id": "2c70ef96-65b0-452c-bca0-857840d1d547",
    "name": "Ruby",
    "about": "More about the pet.",
    "age": "puppy",
    "size": "small",
    "energyLevel": "high",
    "independenceLevel": "low",
    "environment": "small",
    "createdAt": "2024-03-21T18:20:25.275Z",
    "orgId": "88596954-9a28-4e0b-9619-8455fe17908c"
}
```

### GET `/pets/search`

Return data from a search for pets.

City and state are mandatory, the rest are optional. Accepted values:
- City: [...];
- State: [...];
- Age: puppy, adult, elderly;
- Size: small, medium, big;
- Energy Level: very low, low, medium, high, very high;
- Independence Level: low, medium, high;
- Environment: small, medium, big;

#### Request query
```json
{
    "city": "Belo Horizonte",
    "state": "MG",
}
```

#### Response body
```json
{
    "pets": [
        {
            "id": "2c70ef96-65b0-452c-bca0-857840d1d547",
            "name": "Ruby",
            "about": "More about the pet.",
            "age": "puppy",
            "size": "small",
            "energyLevel": "high",
            "independenceLevel": "low",
            "environment": "small",
            "createdAt": "2024-03-21T18:20:25.275Z",
            "orgId": "88596954-9a28-4e0b-9619-8455fe17908c"
        },
    ]
}
```

---

### Functional Requirements
- It must be possible to register a pet;
- It must be possible to list all pets available for adoption in a city;
- It must be possible to filter pets by their characteristics;
- It must be possible to view details of a pet up for adoption;
- It must be possible to register as an organization;
- It must be possible to authenticate as an organization;

### Business Rules
- To list the pets, we must inform the city and state;
- All filters besides city and state are optional;
- A pet must be linked to an organization;
- An organization needs to have an address and a WhatsApp number;
- The user who wants to adopt will contact the organization via WhatsApp;
- For an organization to access the application as admin, it must be logged in;

### Non-functional requirements
- User password must be encrypted;
- Application data needs to be persisted in a PostgreSQL database;
- All data lists must be pages with 20 items per page;
- The user must be identified by a JWT (JSON Web Token);