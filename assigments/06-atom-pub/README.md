# Assigment 06 - AtomPub
Following xml provides information about one photo album and its photos.

Rewrite the data in the xml to the Atom Syndication Format. When it is necessary, define your own namespace for elements that the standard Atom Syndication Format specification does not define. Use all mandatory fields and also all data/fields in the following xml.

    <album>
        <title>Trip to Prague</title>
        <person>Peter Novak</person> <!-- author -->
        <photo>
            <title>Prague Castle</title> <!-- name of photo -->
            <format>JPG</format> <!-- format of photo -->
            <url>http://store.it/users/432/albums/635/photos/prague-castle.jpg</url>
            <stars>5</stars> <!-- rating of photo -->
        </photo>
        <photo>
            ...
        </photo>
    </album>

The task was done in accordance with https://validator.w3.org/feed/docs/atom.html
