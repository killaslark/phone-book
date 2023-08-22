import { GET_CONTACT_LIST_QUERY } from "../hooks/useContactList"
import { DELETE_CONTACT_QUERY } from "../hooks/useDeleteContact"


export const mockContactsRequest = {
  query: GET_CONTACT_LIST_QUERY,
  variables: {
    offset: 0,
    limit: 10,
    where: undefined
  },
};

export const mockContactsResult = {
  "data": {
    "contact": [
      {
        "created_at": "2023-08-22T12:19:21.73365+00:00",
        "first_name": "John2",
        "id": 4643,
        "last_name": "Doe2",
        "phones": [
          {
            "number": "+62929292922374ds4"
          },
          {
            "number": "+62929292922dsd344"
          }
        ]
      },
      {
        "created_at": "2023-08-22T12:19:32.633108+00:00",
        "first_name": "John2",
        "id": 4644,
        "last_name": "Doe2",
        "phones": [
          {
            "number": "+12312"
          },
          {
            "number": "+1234"
          }
        ]
      },
      {
        "created_at": "2023-08-22T12:19:41.081775+00:00",
        "first_name": "John12",
        "id": 4646,
        "last_name": "Doe12",
        "phones": [
          {
            "number": "+123121"
          },
          {
            "number": "+12341"
          }
        ]
      },
      {
        "created_at": "2023-08-22T12:19:45.844122+00:00",
        "first_name": "John123",
        "id": 4647,
        "last_name": "Doe12",
        "phones": [
          {
            "number": "+1231213"
          },
          {
            "number": "+123413"
          }
        ]
      },
      {
        "created_at": "2023-08-22T12:19:50.530369+00:00",
        "first_name": "John1234",
        "id": 4648,
        "last_name": "Doe124",
        "phones": [
          {
            "number": "+12312134"
          },
          {
            "number": "+1234134"
          }
        ]
      },
      {
        "created_at": "2023-08-22T12:19:55.207175+00:00",
        "first_name": "John12345",
        "id": 4649,
        "last_name": "Doe1245",
        "phones": [
          {
            "number": "+123121345"
          },
          {
            "number": "+12341345"
          }
        ]
      },
      {
        "created_at": "2023-08-22T12:20:03.104197+00:00",
        "first_name": "John6",
        "id": 4650,
        "last_name": "Doe6",
        "phones": [
          {
            "number": "+12316"
          },
          {
            "number": "+123465"
          }
        ]
      },
      {
        "created_at": "2023-08-22T12:20:09.477661+00:00",
        "first_name": "John7",
        "id": 4651,
        "last_name": "Doe7",
        "phones": [
          {
            "number": "+12317"
          },
          {
            "number": "+12347"
          }
        ]
      },
      {
        "created_at": "2023-08-22T12:20:15.427067+00:00",
        "first_name": "John8",
        "id": 4652,
        "last_name": "Doe8",
        "phones": [
          {
            "number": "+12318"
          },
          {
            "number": "+1238"
          }
        ]
      },
      {
        "created_at": "2023-08-22T12:20:15.427067+00:00",
        "first_name": "John9",
        "id": 4653,
        "last_name": "Doe9",
        "phones": [
          {
            "number": "+12319"
          },
          {
            "number": "+12389"
          }
        ]
      }
    ]
  }
}


export const mockContactDeleteRequest = {
  query: DELETE_CONTACT_QUERY,
  variables: {},
};

export const mockContactDeleteResponse = {
  data: {
    delete_contact_by_pk: {
      first_name: 'Jhon',
      last_name: 'Doe',
      id: 4643
    }
  }
}