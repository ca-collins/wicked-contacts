<template>
  <q-page class="flex">
    <div class="full-width q-pl-lg q-pr-lg q-pt-lg">
      <q-table
        :columns="columns"
        v-model:pagination="pagination"
        :rows="filteredRows"
        binary-state-sort
        class="full-width"
        flat
        no-data-label="No contacts found."
        row-key="id"
        title="Contacts"
      >
        <template v-slot:top="props">
          <div class="row full-width justify-between items-center">
            <div class="q-table__title">Contacts</div>
            <q-btn color="primary" label="Contact" icon="add" @click="addRow" />
          </div>
          <q-input
            v-model="search"
            filled
            dense
            debounce="300"
            placeholder="Search"
            style="width: 200px"
            class="q-mt-md"
          />

          <q-tr :props="props">
            <q-td key="firstName" :props="props">
              {{ props.row.firstName }}
              <q-popup-edit v-model="props.row.firstName" v-slot="scope">
                <q-input
                  v-model="scope.value"
                  dense
                  autofocus
                  counter
                  @keyup.enter="scope.set"
                ></q-input>
              </q-popup-edit>
            </q-td>
            <q-td key="lastName" :props="props">
              {{ props.row.lastName }}
              <q-popup-edit v-model="props.row.lastName" v-slot="scope">
                <q-input
                  v-model="scope.value"
                  dense
                  autofocus
                  counter
                  @keyup.enter="scope.set"
                ></q-input>
              </q-popup-edit>
            </q-td>
            <q-td key="email" :props="props">
              {{ props.row.email }}
              <q-popup-edit v-model="props.row.email" v-slot="scope">
                <q-input
                  v-model="scope.value"
                  dense
                  autofocus
                  counter
                  @keyup.enter="scope.set"
                ></q-input>
              </q-popup-edit>
            </q-td>
            <q-td key="phone" :props="props">
              {{ props.row.phone }}
              <q-popup-edit v-model="props.row.phone" v-slot="scope">
                <q-input
                  v-model="scope.value"
                  dense
                  autofocus
                  counter
                  @keyup.enter="scope.set"
                ></q-input>
              </q-popup-edit>
            </q-td>
            <q-td key="actions" :props="props">
              <q-btn
                color="negative"
                icon="delete"
                @click="deleteRow(props.row)"
                round
                flat
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { setupDB, addContact, getContacts } from "src/services/db.js";

export default defineComponent({
  name: "IndexPage",
  setup() {
    const columns = [
      {
        name: "firstName",
        required: true,
        label: "First name",
        align: "left",
        field: (row) => row.firstName,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "lastName",
        required: true,
        label: "Last name",
        align: "left",
        field: (row) => row.lastName,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "email",
        label: "Email",
        align: "left",
        field: (row) => row.email,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "phone",
        label: "Phone",
        align: "left",
        field: (row) => row.phone,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "actions",
        label: "",
        align: "center",
        sortable: false,
      },
    ];

    const rows = ref([]);

    const deleteRow = (row) => {
      console.log("Deleting row:", row);
      // Implement the logic to delete the row
      // For example, you might want to remove the row from your 'rows' array
      // Or make an API call to delete the row from the server
    };

    const addRow = async () => {
      console.log("Adding row");
      const tempContact = {
        firstName: "aaaa!!",
        lastName: "asdfasdf",
        email: "new@test.com",
        phone: "555-555-5555",
      };
      await setupDB(() => {
        addContact(tempContact, (newContact) => {
          console.log("newContact:", newContact);
          rows.value.push(newContact);
        });
      });
    };

    // make above async
    // const addRow = async () => {

    const search = ref("");

    const filteredRows = computed(() => {
      if (!search.value) {
        return rows.value;
      }
      // search by first and/or last name
      const term = search.value.toLowerCase();
      return rows.value.filter(
        (row) =>
          row.firstName.toLowerCase().includes(term) ||
          row.lastName.toLowerCase().includes(term)
      );
    });

    const pagination = ref({
      sortBy: "firstName",
      descending: false,
      page: 1,
      rowsPerPage: 10,
    });

    onMounted(async () => {
      try {
        setupDB(() => {
          getContacts(false, (contacts) => {
            rows.value = contacts;
          });
        });
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    });

    return {
      rows,
      columns,
      addRow,
      deleteRow,
      pagination,
      search,
      filteredRows,
    };
  },
});
</script>
