import json

def get_all_keys(data, parent_key=''):
    """Recursively flattens a nested dictionary and returns a set of all keys."""
    keys = set()
    for k, v in data.items():
        new_key = f"{parent_key}.{k}" if parent_key else k
        keys.add(new_key)
        if isinstance(v, dict):
            keys.update(get_all_keys(v, new_key))
    return keys

def compare_keys(file1_path, file2_path):
    """Compares the keys in two JSON files and returns keys present in file1 but not in file2."""
    try:
        with open(file1_path, 'r', encoding='utf-8') as f1:
            data1 = json.load(f1)
        keys1 = get_all_keys(data1)
    except FileNotFoundError:
        return f"Error: File not found - {file1_path}"
    except json.JSONDecodeError:
        return f"Error: Could not decode JSON from {file1_path}"

    try:
        with open(file2_path, 'r', encoding='utf-8') as f2:
            data2 = json.load(f2)
        keys2 = get_all_keys(data2)
    except FileNotFoundError:
        return f"Error: File not found - {file2_path}"
    except json.JSONDecodeError:
        return f"Error: Could not decode JSON from {file2_path}"

    missing_keys = keys1 - keys2
    return sorted(list(missing_keys))

if __name__ == "__main__":
    en_file = "lang/en.json"
    ar_file = "lang/ar.json"

    missing_in_ar = compare_keys(en_file, ar_file)

    if isinstance(missing_in_ar, str): # Error message
        print(missing_in_ar)
    elif missing_in_ar:
        print(f"Keys present in '{en_file}' but missing in '{ar_file}':")
        for key in missing_in_ar:
            print(key)
    else:
        print(f"All keys from '{en_file}' are present in '{ar_file}'.")

    print("\n--- Comparison Complete ---")

    # For testing the other way around (optional)
    # missing_in_en = compare_keys(ar_file, en_file)
    # if isinstance(missing_in_en, str):
    #     print(missing_in_en)
    # elif missing_in_en:
    #     print(f"\nKeys present in '{ar_file}' but missing in '{en_file}':")
    #     for key in missing_in_en:
    #         print(key)
    # else:
    #     print(f"All keys from '{ar_file}' are present in '{en_file}'.")
