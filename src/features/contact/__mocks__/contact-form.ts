import { CONTACT_DETAIL_QUERY } from "../hooks/useContactDetail";
import { CREATE_CONTACT_QUERY } from "../hooks/useCreateContact";
import { EDIT_CONTACT_QUERY } from "../hooks/useEditContact";
import { EDIT_PHONE_QUERY } from "../hooks/useEditPhone";

export const mockContactFormDetailRequest = {
  query: CONTACT_DETAIL_QUERY,
  variables: { id: "4523" },
}

export const mockContactFormDetailResponse = {
  data: {
    contact_by_pk: {
      "last_name": "Doe12",
      "id": 4523,
      "first_name": "John123",
      "created_at": "2023-08-22T12:19:45.844122+00:00",
      "phones": [
        {
          "number": "+1231213",
          "__typename": "phone"
        },
        {
          "number": "+123413",
          "__typename": "phone"
        }
      ],
      "__typename": "contact"
    }
  }
}

export const mockContactFormEditRequest = {
  query: EDIT_CONTACT_QUERY,
  variables: { id: "4523" },
}

export const mockContactFormEditResponse = {
  data: {
    "update_contact_by_pk": {
      "id": 4523,
      "first_name": "John2asd",
      "last_name": "Doe2",
      "phones": [
        {
          "number": "+12312",
          "__typename": "phone"
        },
        {
          "number": "+1234",
          "__typename": "phone"
        }
      ],
      "__typename": "contact"
    }
  }
}

export const mockContactFormEditNumberRequest = {
  query: EDIT_PHONE_QUERY,
  variables: {
    new_phone_number: "1231421312",
    pk_columns: {
      contact_id: "4523",
      number: "+1231213"
    }
  }
}

export const mockContactFormEditNumberResponse = {
  data: {
    "update_phone_by_pk": {
      "contact": {
        "id": 4647,
        "last_name": "Doe12",
        "first_name": "John123",
        "created_at": "2023-08-22T12:19:45.844122+00:00",
        "phones": [
          {
            "number": "+12312134412",
          },
          {
            "number": "+123413",
          }
        ],
      },
    }
  }
}

export const mockContactFormCreateRequest = {
  query: CREATE_CONTACT_QUERY,
  variables: {
    first_name: "Jhon",
    last_name: "Dhoe",
    phones: [{ number: "1231421312" }]
  },
};

export const mockContactFormCreateResponse = {
  "data": {
    "insert_contact": {
      "returning": [
        {
          "first_name": "John8",
          "last_name": "Doe8",
          "id": 4664,
          "phones": [
            {
              "number": "+1231844"
            },
            {
              "number": "+123811"
            }
          ]
        }
      ]
    }
  }
}