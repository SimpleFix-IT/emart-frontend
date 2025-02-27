<template>
<div class="mb-3">
    <label :for="name" class="form-label">{{ label }}</label>
    <Field v-slot="{ field, meta, }" :name="name">
        <!-- Text, Email, Password, Number -->
        <input v-if="['text', 'email', 'password', 'number'].includes(type)" v-bind="field" :id="name" :type="type" class="form-control" :placeholder="placeholder"  :readonly="readonly" :min="min" :class="{ 'is-invalid': meta.touched && (error) }" />

        <!-- Textarea -->
        <textarea v-else-if="type === 'textarea'" v-bind="field" :id="name" class="form-control" :placeholder="placeholder" :class="{ 'is-invalid': meta.touched && (error ) }"></textarea>

        <!-- Select Dropdown -->
        <select v-else-if="type === 'select'" v-bind="field" :id="name" class="form-select"  :class="{ 'is-invalid': meta.touched && (error ) }">
            <option value="" disabled>Select {{ label }}</option>
            <option v-for="(option, index) in options" :key="index" :value="option.value">
                {{ option.text }}
            </option>
        </select>

        <!-- Checkbox -->
        <div v-else-if="type === 'checkbox'" class="form-check">
            <input v-bind="field" :id="name" type="checkbox" class="form-check-input" />
        </div>
        <!-- Radio Buttons -->
        <div v-else-if="type === 'radio'">
            <div v-for="(option, index) in options" :key="index" class="form-check">
                <input v-bind="field" :id="`${name}-${index}`" :value="option.value" type="radio" class="form-check-input" />
                <label :for="`${name}-${index}`" class="form-check-label">{{ option.text }}</label>
            </div>
        </div>
    </Field>
    <span v-if="error " class="text-danger">{{ error  }}</span>
</div>
</template>

<script>
import {
    Field
} from "vee-validate";

export default {
    props: {
        name: String,
        label: String,
        type: String,
        placeholder: String,
        error: String,
        options: {
        type: Array,
        default: () => []
        },
        min: {
            type: Number,
            default: 1, // Default minimum value is 1
        },
        readonly: {
          type: Boolean,
          default: false, // Default readonly false hoga
        },
    },
    components: {
        Field
    },
    methods: {
        validateNumber(event) {
            if (this.type === "number") {
                let value = event.target.value;

                // Prevent negative values
                if (value < this.min) {
                    event.target.value = this.min;
                }
            }
        },
    },
};
</script>

<style scoped>
.form-check {
    display: inline;
    min-height: 1.5rem;
    padding-left: 1.5em;
    margin-bottom: .125rem;
}

.form-check .form-check-input {
    float: left;
    margin-left: -0.5em;
}

.form-label {
    margin-bottom: .5rem;
    margin-left: 3px;
}
.form-select:focus {
  top: auto !important;
  bottom: auto !important;
}



.form-select option {
  background-color: white;
  color: black;
}

</style>
