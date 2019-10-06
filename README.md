## MGR M.Bury - AEI Virtual Tour - A-Frame

Master's project of an application built on the basis of the A-Frame framework, which enables a virtual tour of the AEII faculty of the Silesian University of Technology.

**Demo**

*here_github_pages_url*

**Running App**

To run the application, you must have a local server that runs files from the given directory under *localhost*.
After that, all you need to do is enter the following in your browser:

`http://localhost:<port>/<path_to_app>/index.html>`

**Add new scenes**

1.  Prepare pictures 
    - the default naming is: 
        >p<floor_number>__<scene_number>

        (i.e. *p1_1*)
2.  Complete the dependency map (`/json/map.json`) for the:
    - source addresses (`.scenes`) of the added photos:
        ```
        "scenes": [
            {
                "id": <photo_id>,
                "src": <photo_src>
            }, 
            ...
        ```
    - parameters of the active elements (`.spots`) - position of spot and rotation of next scene:
        ```
        "spots": [
            {
                "id": <photo_id>,
                "nav": [
                    {
                        "spotProp": "linkto:#<photo_id>; spotgroup:<photo_id>",
                        "position": "<positionX positionY positionZ>",
                        "rotation": "<rotationX rotationY rotationZ>"
                    }
                ]
            },
            ...
        ```