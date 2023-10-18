// TODO: refactoring
// This is mostly copy-pasted from `clovers-cli` at commit 11a2c2854bb9f16c786d4e0e16abc638bdde9826

use clovers::{colorize::colorize, normals::normal_map, ray::Ray, scenes, Float, RenderOpts};
use palette::{
    chromatic_adaptation::AdaptInto, convert::IntoColorUnclamped, white_point::E, IntoColor,
    LinSrgb, Srgb, Xyz,
};
use rand::rngs::SmallRng;
use rand::{Rng, SeedableRng};
use rayon::prelude::*;
use scenes::Scene;

/// The main drawing function, returns a `Vec<Srgb>` as a pixelbuffer.
pub fn draw(opts: RenderOpts, scene: &Scene) -> Vec<Srgb<u8>> {
    // Progress bar
    let pixels = (opts.width * opts.height) as u64;

    let black: Srgb<u8> = Srgb::new(0, 0, 0);
    let mut pixelbuffer = vec![black; pixels as usize];

    pixelbuffer
        .par_iter_mut()
        .enumerate()
        .for_each(|(index, pixel)| {
            // Enumerate gives us an usize, opts.width and opts.height are u32
            // Most internal functions expect a Float, perform conversions
            let x = (index % (opts.width as usize)) as Float;
            let y = (index / (opts.width as usize)) as Float;
            let width = opts.width as Float;
            let height = opts.height as Float;

            // Initialize a thread-local random number generator
            let mut rng = SmallRng::from_entropy();

            // Initialize a mutable base color for the pixel
            let mut color: LinSrgb = LinSrgb::new(0.0, 0.0, 0.0);

            if opts.normalmap {
                // If we are rendering just a normalmap, make it quick and early return
                let u = x / width;
                let v = y / height;
                let ray: Ray = scene.camera.get_ray(u, v, &mut rng);
                color = normal_map(&ray, scene, &mut rng);
                let color: Srgb = color.into_color();
                *pixel = color.into_format();
                return;
            }
            // Otherwise, do a regular render

            // Multisampling for antialiasing
            for _sample in 0..opts.samples {
                if let Some(s) = sample(scene, x, y, width, height, &mut rng, opts.max_depth) {
                    color += s
                }
            }
            color /= opts.samples as Float;
            // Gamma / component transfer function
            let color: Srgb = color.into_color();
            *pixel = color.into_format();
        });

    pixelbuffer
}

/// Get a single sample for a single pixel in the scene. Has slight jitter for antialiasing when multisampling.
fn sample(
    scene: &Scene,
    x: Float,
    y: Float,
    width: Float,
    height: Float,
    rng: &mut SmallRng,
    max_depth: u32,
) -> Option<LinSrgb> {
    let u = (x + rng.gen::<Float>()) / width;
    let v = (y + rng.gen::<Float>()) / height;
    let ray: Ray = scene.camera.get_ray(u, v, rng);
    let new_color: Xyz<E> = colorize(&ray, scene, 0, max_depth, rng);
    let new_color: Xyz = new_color.adapt_into();
    let new_color: LinSrgb = new_color.into_color_unclamped();
    if new_color.red.is_finite() && new_color.green.is_finite() && new_color.blue.is_finite() {
        return Some(new_color);
    }
    None
}
