import React from "react";

export default function Faq() {
	return (
		<>
			<h1>Frequently Asked Questions</h1>
			<br />
			<h2>I can't see any covers/images</h2>
			<p>The covers on this website are in <a href="https://en.wikipedia.org/wiki/WebP">WEBP</a> format, which allows them to be much smaller than the equivalent JPEGs at visually indistingushable quality. They most notably don't work on Safari with MacOS version &lt; 11, because for some reason Apple for the longest time didn't want to play with the other kids, but rather hold the technology of the internet back, so they only added support for it very recently.</p>
			<p><strong>Solutions:</strong> Use an up to date version of a modern browser like chrome, edge, opera, firefox. Alternatively, if you're on a mac and want to keep using Safari, update your MacOS to a newer version (11 or higher).</p>
		</>
	);
}
