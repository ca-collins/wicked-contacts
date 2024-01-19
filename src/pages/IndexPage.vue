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
        <template v-slot:top>
          <div class="row full-width justify-between items-center">
            <div class="q-table__title">Contacts</div>
            <q-btn
              color="primary"
              label="Contact"
              icon="add"
              @click="openAddDialog"
            />
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
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="firstName" :props="props">
              {{ props.row.firstName }}
            </q-td>
            <q-td key="lastName" :props="props">
              {{ props.row.lastName }}
            </q-td>
            <q-td key="email" :props="props">
              {{ props.row.email }}
            </q-td>
            <q-td key="phone" :props="props">
              {{ props.row.phone }}
            </q-td>
            <q-td key="actions" :props="props">
              <q-btn
                color="primary"
                icon="edit"
                round
                flat
                @click="openEditDialog(props.row)"
              />
              <q-btn
                color="negative"
                icon="delete"
                @click="deleteRow(props.row.id)"
                round
                flat
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-dialog v-model="isDialogOpen" class="full-width">
        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6">
              {{ isEditMode ? "Edit Contact" : "Add Contact" }}
            </div>
          </q-card-section>
          <q-form class="q-gutter-md" @submit="saveContact">
            <q-card-section>
              <q-input
                v-model="contactForm.firstName"
                label="First Name"
                :rules="[(val) => !!val || 'First name is required']"
              />
              <q-input
                v-model="contactForm.lastName"
                label="Last Name"
                :rules="[(val) => !!val || 'First name is required']"
              />
              <!--  email input validation -->
              <q-input v-model="contactForm.email" label="Email" type="email" />
              <!-- validate 9 digit phone -->
              <q-input
                v-model="contactForm.phone"
                label="Phone"
                mask="(###) ###-####"
              />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="primary" @click="closeDialog" />
              <q-btn flat label="Save" color="primary" type="submit" />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted, reactive } from "vue";
import {
  addContact,
  getContacts,
  updateContact,
  deleteContact,
} from "src/services/db.js";

export default defineComponent({
  name: "IndexPage",
  setup() {
    const isDialogOpen = ref(false);
    const isEditMode = ref(false);
    const contactForm = reactive({
      id: null,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });
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
    const search = ref("");
    const pagination = ref({
      sortBy: "firstName",
      descending: false,
      page: 1,
      rowsPerPage: 10,
    });

    const rows = ref([]);

    // --- ASYNC METHODS ---
    const addRow = async (contactData) => {
      try {
        const newContact = await addContact(contactData);
        rows.value.push(newContact);
      } catch (error) {
        console.error("Error adding contact:", error);
      }
    };
    const updateRow = async (rowId, updatedData) => {
      try {
        const updatedContact = await updateContact(rowId, updatedData);
        rows.value = rows.value.map((row) =>
          row.id === rowId ? updatedContact : row
        );
      } catch (error) {
        console.error("Error updating contact:", error);
      }
    };
    const deleteRow = async (rowId) => {
      try {
        await deleteContact(rowId);
        rows.value = rows.value.filter((row) => row.id !== rowId);
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    };

    // --- SYNC METHODS ---
    const openAddDialog = () => {
      isEditMode.value = false;
      Object.assign(contactForm, {
        id: null,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      });
      isDialogOpen.value = true;
    };

    const openEditDialog = (contact) => {
      isEditMode.value = true;
      Object.assign(contactForm, contact);
      isDialogOpen.value = true;
    };

    const saveContact = async () => {
      if (isEditMode.value) {
        await updateRow(contactForm.id, contactForm);
      } else {
        await addRow(contactForm);
      }
      closeDialog();
    };

    const closeDialog = () => {
      isDialogOpen.value = false;
    };

    const filteredRows = computed(() => {
      if (!search.value) {
        return rows.value;
      }
      const term = search.value.toLowerCase();
      return rows.value.filter(
        (row) =>
          row.firstName.toLowerCase().includes(term) ||
          row.lastName.toLowerCase().includes(term)
      );
    });

    // --- LIFE CYCLE HOOKS ---
    onMounted(async () => {
      try {
        const contacts = await getContacts();
        rows.value = contacts;
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    });

    return {
      addRow,
      closeDialog,
      columns,
      contactForm,
      deleteRow,
      filteredRows,
      isDialogOpen,
      isEditMode,
      openAddDialog,
      openEditDialog,
      pagination,
      rows,
      saveContact,
      search,
    };
  },
});
</script>
