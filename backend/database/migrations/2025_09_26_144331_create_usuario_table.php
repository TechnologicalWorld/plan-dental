<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('usuario', function (Blueprint $table) {
            $table->string("ci")->primary();
            $table->timestamps();
            $table->string("paterno");
            $table->string("materno")->nullable();
            $table->string("nombre");
            $table->date("fechaNacimiento");
            $table->enum("genero",["F","M"]);
            $table->string("telefono")->nullable();
            $table->string('correo')->unique();
            $table->string('direccion')->nullable();
            $table->string("contrasena");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuario');
    }
};
