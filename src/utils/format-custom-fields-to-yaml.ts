import {
  CompassCustomBooleanField,
  CompassCustomNumberField,
  CompassCustomTextField,
  CompassCustomUserField,
  CustomField,
  CustomFieldFromYAML,
  CustomFieldType,
} from '@atlassian/forge-graphql';

export const isCompassCustomTextField = (customField: CustomField): customField is CompassCustomTextField =>
  (customField as CompassCustomTextField).textValue !== undefined;

export const isCompassCustomNumberField = (customField: CustomField): customField is CompassCustomNumberField =>
  (customField as CompassCustomNumberField).numberValue !== undefined;

export const isCompassCustomBooleanField = (customField: CustomField): customField is CompassCustomBooleanField =>
  (customField as CompassCustomBooleanField).booleanValue !== undefined;

export const isCompassCustomUserField = (customField: CustomField): customField is CompassCustomUserField =>
  (customField as CompassCustomUserField).userIdValue !== undefined;

export const formatCustomFieldsToYamlFormat = (
  customFieldsInComponent: CustomField[],
): CustomFieldFromYAML[] | null => {
  if (!customFieldsInComponent?.length) {
    return null;
  }

  return customFieldsInComponent.flatMap((customField) => {
    const mappedCustomFieldToYamlFormat = {
      name: customField.definition?.name,
      type: null,
      value: null,
    } as unknown as CustomFieldFromYAML;

    if (isCompassCustomTextField(customField)) {
      mappedCustomFieldToYamlFormat.type = CustomFieldType.TEXT;
      mappedCustomFieldToYamlFormat.value = customField.textValue || null;
      return [mappedCustomFieldToYamlFormat];
    }

    if (isCompassCustomBooleanField(customField)) {
      mappedCustomFieldToYamlFormat.type = CustomFieldType.BOOLEAN;
      mappedCustomFieldToYamlFormat.value = customField.booleanValue || false;
      return [mappedCustomFieldToYamlFormat];
    }

    if (isCompassCustomNumberField(customField)) {
      mappedCustomFieldToYamlFormat.type = CustomFieldType.NUMBER;
      mappedCustomFieldToYamlFormat.value = customField.numberValue || null;
      return [mappedCustomFieldToYamlFormat];
    }

    if (isCompassCustomUserField(customField)) {
      mappedCustomFieldToYamlFormat.type = CustomFieldType.USER;
      mappedCustomFieldToYamlFormat.value = customField?.userIdValue || null;
      return [mappedCustomFieldToYamlFormat];
    }

    // Future types added here will return an empty array which the flatmap
    // will remove resulting in no code being shown in the yaml file and no
    // errors being thrown
    return [];
  });
};
