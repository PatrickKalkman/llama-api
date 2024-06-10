import requests
import yaml

# Download the openapi.yaml file content from the GitHub repository
url = "https://raw.githubusercontent.com/openai/openai-openapi/master/openapi.yaml"
response = requests.get(url)

# Helper function to remove duplicate anchors
def remove_duplicate_anchors(yaml_content):
    lines = yaml_content.split('\n')
    seen_anchors = set()
    cleaned_lines = []

    for line in lines:
        if '&' in line:
            anchor = line.split('&')[1].split()[0]
            if anchor in seen_anchors:
                line = line.replace(f'&{anchor}', '')
            else:
                seen_anchors.add(anchor)
        cleaned_lines.append(line)

    return '\n'.join(cleaned_lines)

# Clean the YAML content to remove duplicate anchors
cleaned_yaml_content = remove_duplicate_anchors(response.text)

# Load the OpenAPI YAML content
openapi_spec = yaml.safe_load(cleaned_yaml_content)

# Extract endpoints from the OpenAPI specification
endpoints = []
for path, methods in openapi_spec.get('paths', {}).items():
    for method in methods:
        endpoints.append(f"{method.upper()} {path}")

# Print the list of endpoints
for endpoint in endpoints:
    print(endpoint)
