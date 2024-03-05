# Backend Challenge - Riderize

## Technologies

- TypeScript
- Express
- Postgres
- Redis
- Docker
- Vitest

## Challenge context - Done

The goal of this challenge is to create an API that will enable users to create cycling events (rides). Additionally, other users should be able to view these rides and subscribe to them so that on the scheduled day, those who have subscribed can cycle together.

To achieve this, the following tasks need to be completed:

Create the rides with the following data:

| Atributo                |  Tipo  | Nullable |
| ----------------------- | :----: | -------: |
| id                      |   -    |    false |
| name                    | string |    false |
| start_date              |  Date  |    false |
| start_date_registration |  Date  |    false |
| end_date_registration   |  Date  |    false |
| additional_information  |  text  |     true |
| start_place             | string |    false |
| participants_limit      | number |     true |

Once created, the cycling events should be displayed so that users can subscribe. To do this, the following data needs to be provided:

| Atributo          | Tipo | Nullable |
| ----------------- | :--: | -------: |
| ride_id           |  -   |    false |
| user_id           |  -   |    false |
| subscription_date | Date |    false |

- It will also be necessary to list the cycling events in which the user participated.
- List the cycling events that the user created.
- Do not allow subscriptions to cycling events after the last registration date.
- User_id comes from a user table of your choice.

## Bônus

- Cache the queries for listing cycling events. - Done
- Use Docker to run the project. - Done
- Host the API (Heroku, AWS, GCP).
- Build a CI/CD pipeline.
- Create automated tests for the API. - Done

### Source: https://github.com/Riderize/backend-test
