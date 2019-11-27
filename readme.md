# Email Project

This project is about the Server Email that you can send and read email

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install this project.

```bash
npm install
```

## Usage


Method: GET

Route : /

```json
{
    "configEmail": {
        "email": "mail",
        "password": "password"
    },
    "configMessage": {
        "from": "mail_to_send",
        "to": "mail_to_receive",
        "subject": "subject_mail",
        "text": "body_of_mail"
    }
}
```
Method: GET

Route: /read

```json
{
    "configEmail": {
        "email": "mail",
        "password": "password",
        "office365": true //True is mail for office365
    }
}

```
Method: GET

Route: /readJob

```json

{
	"email" : "mail"
}
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)