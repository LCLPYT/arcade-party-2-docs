# The Configuration Data Container
The configuration data container is a simple key-value store containing configurable data.

This data is used, for example as source for game developer names and map author names.

It can be configured in `src/lib/src/main/resources/configuration.json`.

Examples of this data configuration include:
```json
{
  "person.lclp": "LCLP",
  "person.bops": "bops",
  "person.secuenix": "Secuenix"
}
```

Values can then be retrieved using a special notation like `@person.lclp`, which returns "LCLP" in this case.

This system allows for use in other JSON files or programmatically without hardcoding the actual name.
That way, if a person wants their credit to be under a different name, it can just be changed in one location and will take effect everywhere.