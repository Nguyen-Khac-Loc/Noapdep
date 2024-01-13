export const displayMap = (locations) => {
	mapboxgl.accessToken =
		'pk.eyJ1IjoibG5kZG5uMzAxMiIsImEiOiJjbHF3MWo3ZDMwMXA0MmtzZ3JldzY4a3lhIn0.cAZlRW_cgF6oGrl157CyEQ';
	const map = new mapboxgl.Map({
		container: 'map', // container ID
		style: 'mapbox://styles/lnddnn3012/clqxe5778011m01qu6dhog6se/draft', // style URL
		scrollZoom: false,
		doubleClickZoom: false,
		// center: [-118.113491, 34.111745], // starting position [lng, lat]
		// zoom: 9, // starting zoom
		//interactive: false,
	});

	const bounds = new mapboxgl.LngLatBounds();

	locations.forEach((location) => {
		//tao marker
		const el = document.createElement('div');
		el.className = 'marker';
		//them marker vao map
		new mapboxgl.Marker({
			element: el,
			anchor: 'bottom',
		})
			.setLngLat(location.coordinates)
			.addTo(map);

		map.on('click', (e) => {
			new mapboxgl.Popup({ offset: 30 })
				.setLngLat(location.coordinates)
				.setHTML(`<p>Ngày ${location.day}: ${location.description}</p>`)
				.addTo(map);
		});
		//thay bang vi tri hien tai
		bounds.extend(location.coordinates);
	});
	map.fitBounds(bounds, {
		padding: {
			top: 200,
			bottom: 150,
			left: 100,
			right: 100,
		},
	});
};
